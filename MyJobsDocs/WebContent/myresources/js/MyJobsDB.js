

 
 
 

function opMessage(msg){



	opLog(msg);


}
function prepLogMessage(msg){

nowd=getDate();
nowt=getTime();
dtstamp=nowd+nowt;


return('INSERT INTO LogFile (datestamp , type, message ) VALUES ("'+dtstamp+'","I","'+ msg+'")');

}
function opLog(msg){

nowd=getDate();
nowt=getTime();
dtstamp=nowd+nowt;


var sqlstatement='INSERT INTO LogFile (datestamp , type, message ) VALUES ("'+dtstamp+'","I","'+ msg+'");';
	if (localStorage.getItem("Trace")=='ON'){
		html5sql.process(sqlstatement,
						 function(){
							 //alert("Success Creating Tables");
						 },
						 function(error, statement){
							 window.console&&console.log("Error: " + error.message + " when processing " + statement);
						 }        
				);

	}
}
function getTraceState(){
traceState="OFF";
xtraceState="";
	html5sql.process(
		["SELECT * from MyWorkConfig where paramname = 'TRACE'"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				traceState= rowsArray[0].paramvalue;
				}
			localStorage.setItem('Trace',traceState);
			$('#traceState').val(traceState); 	
			$('#traceState').selectmenu('refresh', true);

		},
		 function(error, statement){
			 window.console&&console.log("Error: " + error.message + " when processing " + statement);
		 }   
	);
}	

function databaseExists(){

	html5sql.process(
		["SELECT * FROM sqlite_master WHERE type='table';"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 10) {
				//alert("Database Existsh");
				return(true);
				}
			//alert("Database does not exist")
			return(false);

		},
		 function(error, statement){
			 window.console&&console.log("Error: " + error.message + " when processing " + statement);
			 return(false);
		 }   
	);
	
}	



function GetConfigParam(paramName){

	html5sql.process(
		["SELECT * from MyWorkConfig where paramname = '"+paramName+"'"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				if (paramName == "TRACE"){
					parTrace=item['paramvalue'];
				}
				
			}
	

		},
		 function(error, statement){
			 window.console&&console.log("Error: " + error.message + " when processing " + statement);
		 }   
	);
}


function updateDocServer(docserver){

	opMessage("Setting DocServer = "+docserver);
	html5sql.process("UPDATE MyUserDets set docserver = '"+docserver+"' Where user = '"+localStorage.getItem("MobileUser")+"';",
	 function(){
		localStorage.setItem("DOCSERVER",docserver)
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when docserver " + statement);
	 }        
	);


}




function deleteAllDocs()
{

	
	sqlStatement="delete from MyJobsDocs"
	
	html5sql.process(sqlStatement,
		 function(){
		
				
					alert("All Docs deleted")
				
		 },
		 function(error, statement){
			 alert("Error: " + error.message + " when FormsResponses processing " + statement);
			
		 }        
		);
}
function updateDocumemntsTable(url, name,type,size,lastmod)
{

	
	sqlStatement=
	
	sqlStatement="select * from MyJobsDocs where url  = '"+url+"' and name = '"+name+"';"
	
	html5sql.process(sqlStatement,
		function(transaction, results, rowsArray){
			if(rowsArray<1){
				sqlMyJobsDocs+="insert into MyJobsDocs (url, name,type,size,lastmod, status) values ("+
				"\""+url+"\","+"\""+name+"\","+"\""+type+"\","+"\""+size+"\","+"\""+lastmod+"\", \"REMOTE\");" // New Download
			}else if((rowsArray[0].type==type)&&(rowsArray[0].size==size)&&(rowsArray[0].lastmod==lastmod)){
				
				sqlMyJobsDocs+="UPDATE MyJobsDocs SET status = \"LOCAL\" , size = \""+size+"\" , lastmod = \""+lastmod+"\" where id = "+rowsArray[0].id+";" // File not changed so dont Download
			}else{
				sqlMyJobsDocs+="UPDATE MyJobsDocs SET status = \"REMOTECHANGED\" , type = \""+type+"\" , size = \""+size+"\" , lastmod = \""+lastmod+"\" where id = "+rowsArray[0].id+";"// File Changed so download
			}
			
		 },
		 function(error, statement){
			 alert("Error: " + error.message + " when FormsResponses processing " + statement);
			opMessage("Error: " + error.message + " when FormsResponses processing " + statement);
		 }        
		);
}
function updateDocsTable()
{
	
	html5sql.process(sqlMyJobsDocs,
			function(transaction, results, rowsArray){
						

				html5sql.process("select count(*)  as tot,  (select count(*) from MyJobsDocs where status = \"DELETE\") as del,  " +
						"(select count(*) from MyJobsDocs where status = \"REMOTE\") as ins, "+
						"(select count(*) from MyJobsDocs where status = \"REMOTECHANGED\") as mod, "+
						"(select count(*) from MyJobsDocs where status = \"LOCAL\") as loc from MyJobsDocs",
		
						function(transaction, results, rowsArray){

							document.getElementById('DocTot').innerHTML=rowsArray[0].tot
							document.getElementById('DocDel').innerHTML=rowsArray[0].del
							document.getElementById('DocNew').innerHTML=rowsArray[0].ins
							document.getElementById('DocMod').innerHTML=rowsArray[0].mod
							document.getElementById('DocLoc').innerHTML=rowsArray[0].loc
							
							html5sql.process("select * from MyJobsDocs where status = \"REMOTE\" or status = \"REMOTECHANGED\"",
					
									function(transaction, results, rowsArray){

										oProgIndDL.setPercentValue(5);
										oProgIndDL.setDisplayValue("5" + "%");
										percentagedownloaded=0;
										fileDownloadCnt=0;
										
										filesToDownload = rowsArray;
										
										checkFileDownload()
									 },
									 function(error, statement){

									 }        
									);

						 },
						 function(error, statement){

						 }        
						);
			 },
			 function(error, statement){
				 alert("Error: " + error.message + " docs " + statement);
				opMessage("Error: " + error.message + " when FormsResponses processing " + statement);
			 }        
			);
	

}

//*************************************************************************************************************************
//
//  Create Database Tables
//
//*************************************************************************************************************************
function createTables(type) { 




	//opMessage("Creating The Tables");	
        
		sqlstatement='CREATE TABLE IF NOT EXISTS LogFile    			( id integer primary key autoincrement, datestamp TEXT, type TEXT, message TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+
		 'CREATE TABLE IF NOT EXISTS MyJobsDocs			    ( id integer primary key autoincrement, url TEXT, name TEXT, type TEXT, size TEXT, lastmod TEXT, status TEXT,recordupdated TIMESTAMP DATETIME DEFAULT(STRFTIME(\'%Y-%m-%d %H:%M:%f\', \'NOW\')));'+

		
		html5sql.process(sqlstatement,
						 function(){
							
							emptyTables(type);
							try {
								window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, buildDirs, buildDirsErrorHandler);
							}
							catch(err) {
							   //Not in Cordova
							}

							
							
						 },
						 function(error, statement){
							
							 opMessage("Error: " + error.message + " when create processing " + statement);
							
							 
						 }        
				);


}

function buildDirsErrorHandler(error){

    alert("Failed to create The Directories: "+ error);
}
function buildDirs(fs) {


	
    var entry=fs; 

    entry.getDirectory("MyJobs", {create: true, exclusive: false}, 
    		function(dir){
		    	 console.log("Created dir "+dir.name); 
		    }, function(error){
		    	 console.log("error Creating Di MyJobs "+error); 
		    }); 

    entry.getDirectory("MyJobs/Global", {create: true, exclusive: false}, 
    		function(dir){
		    	 console.log("Created dir Global"+dir.name); 
		    }, function(error){
		    	 console.log("error Creating Di MyJobs-Global "+error); 
		    }); 

    entry.getDirectory("MyJobs/Private", {create: true, exclusive: false}, 
    		function(dir){
		    	 console.log("Created dir Private"+dir.name); 
		    }, function(error){
		    	 console.log("error Creating Di MyJobs-Private "+error); 
		    });

    entry.getDirectory("MyJobs/Private/Download", {create: true, exclusive: false}, 
    		function(dir){
		    	 console.log("Created dir Private-Download"+dir.name); 
		    }, function(error){
		    	 console.log("error Creating Di MyJobs-Private-Download"+error); 
		    });

    entry.getDirectory("MyJobs/Private/Upload", {create: true, exclusive: false}, 
    		function(dir){
		    	 console.log("Created dir Private-Upload"+dir.name); 
		    }, function(error){
		    	 console.log("error Creating Di MyJobs-Private-Upload"+error); 
		    });

entry.getDirectory("MyJobs/Private/Photos", {create: true, exclusive: false}, 
		function(dir){
	    	 console.log("Created dir Private-Photos"+dir.name); 
	    }, function(error){
	    	 console.log("error Creating Di MyJobs-Private-Photos"+error); 
	    });

    entry.getDirectory("MyJobs/Global/Download", {create: true, exclusive: false}, 
    		function(dir){
		    	 console.log("Created dir Global-Download"+dir.name); 
		    }, function(error){
		    	 console.log("error Creating Di MyJobs-Global-Download"+error); 
		    });

    entry.getDirectory("MyJobs/Global/Upload", {create: true, exclusive: false}, 
    		function(dir){
		    	 console.log("Created dir Global-Upload"+dir.name); 
		    }, function(error){
		    	 console.log("error Creating Di MyJobs-Global-Upload"+error); 
		    });

}
//*************************************************************************************************************************
//
//  Delete all Tables
//
//*************************************************************************************************************************
function dropTables() { 


		sqlstatement=	'DROP TABLE IF EXISTS LogFile;'+
					
					'DROP TABLE IF EXISTS  MyJobsDocs;'
						html5sql.process(sqlstatement,
						 function(){
							 //alert("Success dropping Tables");
						 },
						 function(error, statement){
							
						 }        
				);
}
function emptyTables(type) { 
	
		sqlstatement=	'DELETE FROM  LogFile;'+
						
					'DELETE FROM  MyJobsDocs;'
						
						

						html5sql.process(sqlstatement,
						 function(){
							
							 window.location.href="index.html"	
							
						
							
 
						 },
						 function(error, statement){
							
							 opMessage("Error: " + error.message + " when delete processing " + statement);
						 }        
				);
}

function resetTables() { 
	var sqlstatement="";

	sqlstatement=	'DELETE FROM  LogFile;'+
					'DELETE FROM  MyJobsDocs;'
					
					

					html5sql.process(sqlstatement,
					 function(){



						 window.location.href="index.html"


					 },
					 function(error, statement){
					
						 opMessage("Error: " + error.message + " when delete processing " + statement);
					 }        
			);
}
function DeleteLog() { 
		html5sql.process("DELETE FROM LogFile",
						 function(){
							
						 },
						 function(error, statement){
							 opMessage("Error: " + error.message + " when processing " + statement);
						 }        
				);

}
function createDB(type){

		createTables(type);

		


}	


function requestDEMOData(page){
		
		opMessage("DEMOLoad "+page);
		
		$.getJSON("TestData/"+page,function(data,status){ 	
			
			if(page=='MyJobsOrders.json'){
				
				orderCB(data);
				
			}
			if(page=='MyJobsNotifications.json'){
				
				notificationCB(data);
			
			}
			if(page=='MyJobsUsers.json'){
				userCB(data);
				
			}
			if(page=='MyJobsAssetPlantsExt.json'){
				assetPlantsCB(data);
				
			}
			if(page=='MyForms.json'){
				formCB(data);
				
			}
			if(page=='PE29.json'){
				propsCB(data);
				
			}
			if(page=='POSTRIDGE2.json'){
				
				assetdetailsCB(data);
				
			}
			if(page=='MyJobsOrdersObjects.json'){
				orderobjectsCB(data);
				
			}
			if(page=='MyJobsRefData.json'){
				
				refdataCB(data);
				
			}
			if(page=='MyJobsRefJobsDataCodes.json'){
				refdatacodesCB(data);
				
			}		
			if(page=='MyJobsVehicles.json'){
				vehicleCB(data);
				
			}
			if(page=='MyJobsVehiclesDefault.json'){
				vehicleDefaultCB(data);
				
			}
			if(page=='MyMessagesData.json'){
				messageCB(data);
				
			}	
			if(page=='GASSurvey.json'){
				refgasCB(data);
				
			}
			if(page=='GASSurveyHdr.json'){
				refgashdrCB(data);
				
			}
			if(page=='funclocs.json'){
				refflocsCB(data);
				
			}
			if(page=='TimeSheetNPJobs.json'){
				tsnpjobsCB(data);
			
			}
			if(page=='TimeSheetActivities.json'){
				tsactivitiesCB(data);

			}
			if(page=='MySurveys.json'){
				
				surveysCB(data);

			}
			if(page=='MyJobsDG5Codes.json'){
							
							dg5CB(data);
			
						}
			  })
  .fail(function(data,status) {
    alert( "error:"+status+":"+data );
  })
}




function existsInArray(array,val){
	
	retv=false;
	for(var cntx=0; cntx <   array.length ; cntx++){
		if(array[cntx]==val){
			retv=true;
			cntx=array.length;
		}
	}
	return retv
}
