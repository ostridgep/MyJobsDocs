
var eqAttrLayout1 = new sap.ui.layout.form.GridLayout();
              var frmEQAttr = new sap.ui.layout.form.Form({
                     
                     editable: false,
                     layout: eqAttrLayout1,
                     formContainers: [

                           new sap.ui.layout.form.FormContainer("eqAttributes",{
                                  
                                  formElements: [

                                        

                          
                           
                           ]
                           
              })   
          ]
              
 })
function buildDEQAttr(eq){
            	  sqlstatement1="select * from MyJobsDetsEQ where equnr= '"+eq+"'"
            	  sqlstatement2="select distinct charact, charact_desc, value from MyJobsDetsATTR where equnr= '"+eq+"'"
            	  sap.ui.getCore().getElementById('eqAttributes').destroyFormElements() 	 			
            	  html5sql.process(sqlstatement1,
            			  function(transaction, results, rowsArray){
		            		  sap.ui.getCore().getElementById('eqAttributes').addFormElement(
		        	 					new sap.ui.layout.form.FormElement({
		        	 							label: "Asset",
		        	 							fields: [new sap.m.Input({type: sap.m.InputType.Input, value: eq + " - "+ rowsArray[0].obj_type_desc, enabled: false})]
		        	 						}))	
							 sap.ui.getCore().getElementById('eqAttributes').addFormElement(
						    	 					 new sap.ui.layout.form.FormElement({
						    	                          label: "Make",
						    	                          fields: [
						    	                                   new sap.m.Input({type: sap.m.InputType.Input, value: rowsArray[0].manfacture, enabled: false}),
						    	                                   new sap.m.Label({text:"Model:"}),
						    	                                   new sap.m.Input({type: sap.m.InputType.Input, value: rowsArray[0].manparno, enabled: false})
						    	                          ]
						    	                   }))
						    	             sap.ui.getCore().getElementById('eqAttributes').addFormElement(
						    	            		 new sap.ui.layout.form.FormElement({
						    	                         label: "Serial No",
						    	                         fields: [new sap.m.Input({type: sap.m.InputType.Input, value: rowsArray[0].manserno, enabled: false})
						    	                         ]
						    	                     }))
						     html5sql.process(sqlstatement2,
						    		 function(transaction, results, rowsArray){
								    	 			
								    	 for(var cntx=0; cntx < rowsArray.length ; cntx++)
											{
								    		 sap.ui.getCore().getElementById('eqAttributes').addFormElement(
						    	            		  new sap.ui.layout.form.FormElement({
						    	                          
						    	                          fields: [
						    	                                   
						    	                                   new sap.m.Label({text:rowsArray[cntx].charact_desc}),
						    	                                   new sap.m.Input({type: sap.m.InputType.Input, value: rowsArray[cntx].value, enabled: false})
						    	                          ]
						    	                      }))
													
											}
						    	              
						    	               
									 },
									 function(error, statement){
										
										 opMessage("Error: " + error.message + " when processing EQAttributes " + statement);
									 }        
					)
            	  },
            	  function(error, statement){
						 opMessage("Error: " + error.message + " when processing " + statement);
						
					 }        
					);
       
       }
