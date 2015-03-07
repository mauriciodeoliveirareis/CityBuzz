var Migration = {};

Migration.client = function() {
    
    var that = this;
    this.ajax_timeout = 120000; // 2 minutes
     
    this.checkout = function(migration_items, migration_type) {
    	$('#comment-group_'+migration_type).html("Preparing PVCS operation....");
    	var deferreds = getSomeDeferredStuff(migration_items, "pvcscheckout", migration_type);
    	
    	$.when.apply($,deferreds).done(
    		function() {
    			// All is ready now, so...
    			//$('#comment-group1').html("Checking out files from PVCS....");
    			console.log('Success!');
    			
    			that.backup(migration_items, migration_type);    			
    			
    		}).fail(function() {
    			// Something went wrong, do not proceed with the backup step
    			console.log('The process failed');    		
    		}
    	);
    };
    this.checkout_label = function(label) {
    	// TODO: Implement call on the server-side
    };
    this.download = function(migration_items, migration_type) {
   		
   		var deferreds = getSomeDeferredStuff(migration_items, "netstordownload", migration_type);
   		
   		$.when.apply($,deferreds).done(
   			function() {
   				console.log('Success NETSTOR!');
   				
   				//TODO: Separate migrations: DevToQA, QAToStage, etc.
    			that.backup(migration_items, migration_type);
   				   				   				
   			}).fail(function() {
   				// Something went wrong, do not proceed with the upload step
   				console.log('The process failed NETSTOR');    		
   			}
   		);
   	};
   	this.backup = function(migration_items, migration_type) {
   		
   		//$('#comment-group_'+migration_type).html("Preparing Neststor operation....");
   		var deferreds = getSomeDeferredStuff(migration_items, "netstorbackup", migration_type);
   		
   		$.when.apply($,deferreds).done(
   			function() {
   				// All is ready now, so...
   				//$('#comment-group_'+migration_type).html("Downloading files from NETSTOR (BACKUP)....");
   				console.log('Success NETSTOR!');
   				
   				//TODO: Separate migrations: DevToQA, QAToStage, etc.
    			that.upload(migration_items, migration_type);
   				   				   				
   			}).fail(function() {
   				// Something went wrong, do not proceed with the upload step
   				console.log('The process failed NETSTOR');    		
   			}
   		);
   	};
   	this.upload = function(migration_items, migration_type) {
   		
   		//$('#comment-group_'+migration_type).html("Preparing Neststor operation....");
   		var deferreds = getSomeDeferredStuff(migration_items, "netstorupload", migration_type);
   		
   		$.when.apply($,deferreds).done(
   			function() {
   				// All is ready now, so...
   				//$('#comment-group_'+migration_type).html("Uploading files to NETSTOR....");
   				$('#comment-group_'+migration_type).html(migration_type +" migration - COMPLETE");
   						//"Backup stored in: netstor_" + $('#userIdTag').html().substr(7)+"_bkp<timestamp>");
   				console.log('Success NETSTOR UPLOAD!');
   				
   				//Clear files within the pvcs_x and netstor_x folders
   				
   			}).fail(function() {
   				// Something went wrong
   				console.log('The process failed NETSTOR UPLOAD');    		
   			}
   		);
   	};
   	this.acme = function(environment, operation, test) {
   		
   		$('#comment-group_').html("<img src='/MigrationOMaticWeb/assets/img/loading.gif'> Processing ACME " + operation);
   	    
   		$.ajax({
   			url : "/MigrationOMaticWeb/MigrationOMaticServlet",
   			data: {
   				migration: environment,
   				action: operation,
   				isTest : test			
   			},
   			type: "POST",
   			dataType : "json",
   			success : function(json_response) {
   				
   				//show jqmodal dialog
   				console.log(json_response);
   				console.log("ACME "+ operation +" success!");			
   			},
   			error : function(json_response) {
   				console.log("ACME "+ operation +" failed!");   				
   			},
   			timeout: Migration.client.ajax_timeout 			
   		});
   	};

   	return this;
};

$( document ).ready(function() {
	
	//AJAX:
	//http://localhost:8080
	
	
	$('#dialog').jqm({
		onHide: function(hash) {
			//$("#dialog-msg").html('');
			$("#dialog-msg").css('height','auto');
			hash.w.fadeOut('2000',function(){
				hash.o.remove();
			});
		}}); 
	
	$('.migration-edit-button').click(function() {
		$('#dialog').jqmShow();
	});
	
	$('#accept-migration-template').click(function() {
		
		//clear migration template
		$('.migration-item-box').html("");
		
		var migration_list_items = $('#migration-list-items').val().split("\n");
		
		//console.log(migration_list_items);
		
		for(mi in migration_list_items) {
			var migration_list_item_html =
				"<li> \
					<div class='migration-item-row'> \
						<span title='"+ migration_list_items[mi] +"' class='migration-item-row-text'> \
							"+ migration_list_items[mi] +" \
						</span> \
					</div> \
					<div class='migration-status migration-status-ok'></div> \
				</li>";
			
			$('.migration-item-box').append(migration_list_item_html);
		}				
		
		snipMigrationItemsPaths();
		
		$('#dialog').jqmHide();
	});
	
	$('#clear-migration-template').click(function() {
		$('#migration-list-items').val("");
	});	
	
	$('#dev_qa_button').click(function() {
		//invoke checkout for each element in the template/list
		// e.g., /View/PIPBCORP/JDPB_main.jsp
		
		clearMessages();
		clearProgressBars();
		
		var migration_items = [];				
		
		$('.migration-item-row span').each(function() {
			migration_items.push( $(this) );
		});
		
		var pvcsclient = new Migration.client();
		
		pvcsclient.checkout( migration_items , "qa");
	});
	$('#dev_qa_button').click(function() {
		var acmeclient = new Migration.client();
		acmeclient.checkout( migration_items , "qa");
	});
	
	$('#qa_stg_button').click(function() {
		clearMessages();
		clearProgressBars();
		
		var migration_items = [];				
		
		$('.migration-item-row span').each(function() {
			migration_items.push( $(this) );
		});
		
		var netstorclient = new Migration.client();
		
		netstorclient.download( migration_items , "stg");
	});
	$("[id^=acme_]").click(function() {
		var regex = /acme_(.*)_(.*)_button/g;
		var match = regex.exec($(this).attr('id'));
		var environment = match[1];
		var operation = match[2];
		var isTest = $('#'+environment+'_checkbox').is(":checked");
		//console.log(environment); console.log(operation); console.log(isTest);
		
		var migrationclient = new Migration.client();
		migrationclient.acme(environment, operation, isTest);		
	});
});

function getSomeDeferredStuff(migration_items, mi_action, migration_type) {
    var deferreds = [];
    
    $('#comment-group_'+migration_type).html("<img src='/MigrationOMaticWeb/assets/img/loading.gif'>" + mi_action);
    
    for (var mi_index in migration_items) {
        
    	var mi_tag = migration_items[mi_index];
    	
    	deferreds.push(
    		ajaxMoMCall(mi_tag, mi_action, migration_type)
    	);
    }

    return deferreds;
}

function ajaxMoMCall(mi_tag, mi_action, migration_type) {
	return $.ajax({
		url : "/MigrationOMaticWeb/MigrationOMaticServlet",
		data: {
			migration : migration_type,
			action: mi_action,
			migration_item : mi_tag.attr('title')			
		},
		type: "POST",
		dataType : "json",
		success : function(json_response) {

			//clear current style
			clearProgressBar(mi_tag);
			
			mi_tag.parent().css('background-color', '#86C67C');
			progress(100, mi_tag.parent(), "ok");
			console.log(mi_tag.html());			
		},
		error : function(json_response) {
			clearProgressBar(mi_tag);
			mi_tag.parent().css('background-color', '#c97185');
			progress(100, mi_tag.parent(), "fail");    				
		},
		timeout: Migration.client.ajax_timeout 			
	});
}
function clearMessages() {
	$("[id^=comment-group_]").html('');
}
function clearProgressBar(mi_tag) {
	mi_tag.parent().css('width', '1');
	mi_tag.parent().css('background-color', 'white');
	mi_tag.parent().next().removeClass( "migration-status-ok");
	mi_tag.parent().next().removeClass( "migration-status-fail");	
}
function clearProgressBars() {
	//clear current items
	$('.migration-item-row span').each(function() {
		$(this).parent().css('width', '1');
		$(this).parent().css('background-color', 'white');
		$(this).parent().next().removeClass( "migration-status-ok");
		$(this).parent().next().removeClass( "migration-status-fail");
	});
}
function snipMigrationItemsPaths() {
	var migration_items_text_list = $( ".migration-item-row-text" );
	
	migration_items_text_list.each(function(){
		var characters_offset = $(this).html().length-50;

		$(this).html($(this).html().substring(characters_offset,$(this).html().length));
	});
}

function progress(percent, migration_item_row, status) {
	
	var progressBarWidth = percent * 303 / 100;
			
	migration_item_row.stop(true, false).animate({
		width: progressBarWidth
	}, 2500, function() {
		// Animation complete.
		if(percent===100) {
			$(this).next().addClass( "migration-status-"+status );
			$(this).next().fadeIn( "slow" );		
			$(this).next().effect( "bounce", {times:3}, 300 );
		}
	});
}