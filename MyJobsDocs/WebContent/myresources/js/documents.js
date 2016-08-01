var globaldocs = new Array()
var privatedownload = new Array()
var privateupload = new Array()
var privatephotos = new Array()
var downloadCount;
var getPhotoCaller="DOC"
var selectedDocTable=""
var selectedPhoto=""
var selectedPhotoID=0;
var selectedPhotoSize=0;
var DeviceStorageDirectory;
var AppDocDirectory;


	var selectedPhotoType=""
	var GlobalDirectory=""
	var appDirectory=""
		var oProgInd= new sap.m.ProgressIndicator("pi1", {
			width:"100%",
			percentValue:0,
			displayValue:"0%",
			showValue:true
		});
	var oProgIndDL= new sap.m.ProgressIndicator("pi2", {
		width:"100%",
		percentValue:0,
		displayValue:"0%",
		showValue:true
	});
var formDownloadFiles = new sap.m.Dialog("dlgDownloadFiles",{
		    title:"Download Files",
		    modal: true,
		    contentWidth:"1em",
		    buttons: [
		  
						new sap.m.Button( {
						    text: "Close",
						    type: 	sap.m.ButtonType.Reject,
						    tap: [ function(oEvt) {		  
								 
						    	formDownloadFiles.close()
								  } ]
						}),
						new sap.m.Button( {
						    text: "Download",
						    type: 	sap.m.ButtonType.Accept,
						    tap: [ function(oEvt) {		  
						    	downloadAll(); 
						    	//formDownloadFiles.close()
								  } ]
						}),
						new sap.m.Button( {
						    text: "Delete",
						    type: 	sap.m.ButtonType.Accept,
						    tap: [ function(oEvt) {		  
						    	deleteAllDocs(); 
						    	//formDownloadFiles.close()
								  } ]
						})
						],					
		    content:[
		             new sap.m.Label({text:"Checking Server for Documents:"}),
		             oProgInd,
		            new sap.ui.core.HTML({  
					      content: 
					    	    ["<Table><TR><TD>Total on Server:</TD><TD><label id ='DocTot'>0</LABEL></TD></TR>"+
					    	     "<TR><TD>No to Delete:</TD><TD><LABEL id ='DocDel'>0</LABEL></TD></TR>" +
					    	     "<TR><TD>New Documents:</TD><TD><LABEL id ='DocNew'>0</LABEL></TD></TR>"+
					    	     "<TR><TD>Modified Ddocuments:</TD><TD><LABEL id ='DocMod'>0</LABEL></TD></TR>"+
					    	     "<TR><TD>Local Documents:</TD><TD><LABEL id ='DocLoc'>0</LABEL></TD></TR></table>"
					    	     ]}),
					 new sap.m.Label({text:"Downloading Documents:"}),
		             oProgIndDL,


		            ],
		            
		            afterOpen:function(){

		    			document.getElementById('DocTot').innerHTML="0"
		    			document.getElementById('DocDel').innerHTML="0"
		    			document.getElementById('DocNew').innerHTML="0"
		    			document.getElementById('DocMod').innerHTML="0"
		    			document.getElementById('DocLoc').innerHTML="0"
				    	oProgInd.setPercentValue(0);
				    	oProgInd.setDisplayValue("0" + "%");
				    	oProgIndDL.setPercentValue(0);
				    	oProgIndDL.setDisplayValue("0" + "%");
		    	
		            },
		            afterClose:function(){

		            	buildGlobalDownloads(AppDocDirectory+"/Global/Download/")
		    	
		            }
		 })




function win(r) {

    alert("Code = " + r.responseCode+"\nResponse = " + r.response+"\nSent = " + r.bytesSent);
   
}

function fail(error) {
    alert("An error has occurred: Code = " + error.code+" source = " + error.source+ " target = " + error.target+" http"+error.http_status );

}


function showFile(file){
	
	window.plugins.fileOpener.open(file)
	//window.open(file, "_blank", 'location=yes,closebuttoncaption=Return') 
	
}

            	

	


function successMoveCallback(entry) {
 alert("New Path: " + entry.fullPath);
   
}

function errorMoveCallback(error) {
    alert("moveCallbackError:" + error.code+":" + error.source+":" + error.target)
    
}
function onDirectorySuccess(parent) {
   
}

function onDirectoryFail(error) {
    //Error while creating directory
    alert("Unable to create new directory: " + error.code);

}

// fileUri = file:///emu/0/android/cache/something.jpg

function moveFile2(fileUri,dir,cnt) {
	
	var opdir = dir;



    var currentdate = new Date();
    var datetime = (currentdate.getFullYear()).toString() + (currentdate.getMonth() + 1).toString() + (currentdate.getFullYear()).toString()
       + (currentdate.getHours()).toString()
                       + (currentdate.getMinutes()).toString()
                       + (currentdate.getSeconds()).toString();
    
                       oldFileUri = fileUri;
                       fileExt = "." + oldFileUri.split('.').pop();

                       newFileName = CurrentOrderNo+CurrentOpNo+"-"+datetime +"_"+cnt+ fileExt;
                  
                       window.resolveLocalFileSystemURL(fileUri, function (file) {
                    	                             
                           window.resolveLocalFileSystemURL(opdir, function (opdir) {
                        	                     	  
            file.moveTo(opdir, newFileName, function (entry) {

            	selectedPhoto="file:///storage/emulated/0"+entry.fullPath
            	formPhotoDetails.open()
            			
            	
            	
               
            }, function (error) {
            	
                alert("error moving:"+error.code+":"+error.source+":"+error.target);
            });
        }, errorMoveCallback);
    }, errorMoveCallback);
}

function buildGlobalDownloads(dir)

{

   
	privatephotos = new Array()
	var opTable = sap.ui.getCore().getElementById("DocumentsGlobalTable");
	opTable.destroyItems();
if(dir!=AppDocDirectory+"/Global/Download/"){
	
		opTable.addItem (new sap.m.ColumnListItem({
			cells : 
				[
				new sap.ui.core.Icon({src : "sap-icon://response"}),
				new sap.m.Text({text: ""}),
	            new sap.m.Text({text: ""}),
	            new sap.m.Text({text: ""}),
				new sap.m.Text({text: ""}),
				new sap.m.Text({text: GlobalDirectory})
		 		]
			}));
}
GlobalDirectory=dir;
try {
	window.resolveLocalFileSystemURL(DeviceStorageDirectory+dir, function (dirEntry) {
    	
        var directoryReader = dirEntry.createReader();
          directoryReader.readEntries(docsGDReadSuccess, docsGDReadFail);
    });
}
catch(err) {
   //Not in Cordova
}
    

}

function docsGDReadFail(error) {
    alert("Failed to list Photos contents: "+ error);
}
function gddocs_details_callback(f) {
    var d1 = new Date(f.lastModifiedDate);

    var opTable = sap.ui.getCore().getElementById("DocumentsGlobalTable");
    if(f.type!=""){
    	x=f.type.split("/")
    	y=d1.toString('yyyyMMdd')
    	z=y.substring(0,24)	
		opTable.addItem (new sap.m.ColumnListItem({
			cells : 
				[
				new sap.ui.core.Icon({src : "sap-icon://document-text"}),
				new sap.m.Text({text: f.name}),
	            new sap.m.Text({text: x[1]}),
	            new sap.m.Text({text: f.size}),
				new sap.m.Text({text: z}),
				new sap.m.Text({text: DeviceStorageDirectory+GlobalDirectory+f.name})
		 		]
			}));
    }
}
function docsGDReadSuccess(entries) {
	 var opTable = sap.ui.getCore().getElementById("DocumentsGlobalTable");
	
  
    var i;
    for (i = 0; i < entries.length; i++) {
       
        if (entries[i].isFile) {
        	
            entries[i].file(gddocs_details_callback);

        } else {
        	opTable.addItem (new sap.m.ColumnListItem({
        		cells : 
        			[
        			new sap.ui.core.Icon({src : "sap-icon://folder"}),
        			new sap.m.Text({text: entries[i].name}),
                    new sap.m.Text({text: ""}),
                    new sap.m.Text({text:""}),
        			new sap.m.Text({text: ""}),
        			new sap.m.Text({text: GlobalDirectory+entries[i].name+"/"})
        	 		]
        		}));
            
       }
    }
}




function createDir(rootDirEntry, folders) {
  // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
  if (folders[0] == '.' || folders[0] == '') {
    folders = folders.slice(1);
  }
  rootDirEntry.getDirectory(folders[0], {create: true}, function(dirEntry) {
    // Recursively add the new subfolder (if we still have another to create).
    if (folders.length) {
      createDir(dirEntry, folders.slice(1));
    }
  }, errorHandler);
};



function errorHandler(error){

	    alert("Failed to create The Directories: "+ error);
	}
var fileDownloadCnt=0;
var percentagedownloaded=0;
var filesToDownload = [];
function downloadAll()
{

			document.getElementById('DocTot').innerHTML="0"
			document.getElementById('DocDel').innerHTML="0"
			document.getElementById('DocNew').innerHTML="0"
			document.getElementById('DocMod').innerHTML="0"
			document.getElementById('DocLoc').innerHTML="0"

	oProgInd.setPercentValue(5);
	oProgInd.setDisplayValue("5" + "%");
	percentagedownloaded=0;
	filesToDownload = [];
	
    $.getJSON(localStorage.getItem("DOCSERVER")+'ListDirjson1.php?directory=MyJobs/Global/download', function (data) {
    	//$.getJSON(localStorage.getItem("DOCSERVER"), function (data) {    
    	filesToDownload=data;
        var cnt = 0;
        st=getFormattedTime()
       
    	if(filesToDownload.FILES.length>0){
    		fileDownloadCnt=0;
    		
    	
    		updateDocumemntsStatus("*","","","","","DELETE")
    		
    		
    		
    		}else{
    		oProgInd.setPercentValue(100);
        	oProgInd.setDisplayValue("100" + "%");
    		}
       
        
    }).success(function() { 
    	
    	})
    .error(function() { 
    	
		oProgInd.setPercentValue(100);
    	oProgInd.setDisplayValue("100" + "%");
    })
    .complete(function() { 
    	
    	

    	
    	
    	});
    
  
	
}



function BuildDocumentsTable() { 
	
	
	//  create a loop function
	   setTimeout(function () {    //  call a 3s setTimeout when the loop is called
		   if(fileDownloadCnt<filesToDownload.FILES.length){
		      updateDocumemntsTable(escape(filesToDownload.FILES[fileDownloadCnt].url),escape(filesToDownload.FILES[fileDownloadCnt].name),filesToDownload.FILES[fileDownloadCnt].type,
		    		  filesToDownload.FILES[fileDownloadCnt].size,filesToDownload.FILES[fileDownloadCnt].lastmod)
	           fileDownloadCnt++;
	           sPercent=getPercentage(filesToDownload.FILES.length,fileDownloadCnt)
	        	if(sPercent < 5){sPercent=5}
	        	if(sPercent!=oProgInd.getPercentValue())
					{
	        		
	        		oProgInd.setPercentValue(sPercent);
	            	oProgInd.setDisplayValue(sPercent + "%");
					}
	        	BuildDocumentsTable();
			   
			}else 
				{
				oProgInd.setPercentValue(100);
			    oProgInd.setDisplayValue("100" + "%");
			   
			    updateDocsTable()

				}

	   }, 10)
	}


function checkFileDownload () { 
	
		
	//  create a loop function
	   setTimeout(function () {    //  call a 3s setTimeout when the loop is called
		   if(fileDownloadCnt<filesToDownload.length){
		       fileName = filesToDownload[fileDownloadCnt].name;
		       if(fileDownloadCnt==10){

		      
		       }
		        window.resolveLocalFileSystemURL(DeviceStorageDirectory+filesToDownload[fileDownloadCnt].url+"/"  + filesToDownload[fileDownloadCnt].name, appStart, downloadAllAsset(filesToDownload[fileDownloadCnt].name, filesToDownload[fileDownloadCnt].url+"/"));
		       fileDownloadCnt++;
	           sPercent=getPercentage(filesToDownload.length,fileDownloadCnt)
	        	if(sPercent < 5){sPercent=5}
	        	if(sPercent!=oProgInd.getPercentValue())
					{
	        		
	        		oProgIndDL.setPercentValue(sPercent);
	            	oProgIndDL.setDisplayValue(sPercent + "%");
					}
	           checkFileDownload(); 	
			}else 
				{
				
				oProgIndDL.setPercentValue(100);
			    oProgIndDL.setDisplayValue("100" + "%");			
				}

	   }, 10)
	}
function getPercentage(tot,val){
	
	var y = Math.round(tot/100) ;
	
	var percent = val / y

	return Math.round(percent) ;
}



function downloadAllAsset(fileName,dir) {
    var fileTransfer = new FileTransfer();
   
     fileTransfer.download(localStorage.getItem("DOCSERVER")+dir+"/" + fileName, cordova.file.externalApplicationStorageDirectory + dir + "/"+fileName,
		function (entry) {
    	opMessage("Downloading"+entry.fullPath)
		   
		},
		function (error) {
		    
		    //alert("download error " + error.source+ ":" + error.target+": " + error.code);
	
		    
		});
}

function appStart() {
   
}
function appStartLL() {
   
}	

