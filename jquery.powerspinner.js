$.fn.PowerSpinner = function () {
	$.fn.PowerSpinner.spinner_id ++;
	var cbs_id = $.fn.PowerSpinner.spinner_id;
	
	var menu2 = 
			"<ul style='z-index:999;display:none; width: 6em;' id='checkboxspinnermenu"+cbs_id+"'>"+
            "<li><a>Res</a></li>"+
            "<li><a>* 10</a></li>" +
            "<li><a>* 10^.1</a></li>" +
            "<li><a>* e</a></li>" +
            "<li><a>* e^.1</a></li>" +
            "<li><a>* 2</a></li>" +
            "<li><a>* 2^.1</a></li>" +
            "<li><a>+ 1000</a></li>" +
            "<li><a>+ 100</a></li>" +
            "<li><a>+ 10</a></li>" +
            "<li><a>+ 1</a></li>" +
            "<li><a>+ 0.1</a></li>" +
            "<li><a>+ 0.01</a></li>" +
            "<li><a>+ 0.001</a></li>" +
        "</ul>";
	$('body').append(menu2);
	
	function do_decrement(old_value, my_spin_mode) {
        // decrement
        switch (my_spin_mode) {
            case 1:
                old_value /= 10;
                break;
            case 2:
                old_value /= Math.pow(10, 0.1);
                break;
            case 3:
                old_value /= Math.exp(1);
                break;
            case 4:
                old_value /= Math.exp(0.1);
                break;
            case 5:
                old_value /= 2;
                break;
            case 6:
                old_value /= Math.pow(2, 0.1);
                break;
            case 7:
                old_value -= 1000;
                break;
            case 8:
                old_value -= 100;
                break;
            case 9:
                old_value -= 10;
                break;
            case 10:
                old_value -= 1;
                break;
            case 11:
                old_value -= 0.1;
                break;
            case 12:
                old_value -= 0.01;
                break;
            case 13:
                old_value -= 0.001;
                break;
        }
        return old_value;	
	}
    function do_increment(old_value, my_spin_mode) {
        // increment
        switch (my_spin_mode) {
            case 1:
                old_value *= 10;
                break;
            case 2:
                old_value *= Math.pow(10, 0.1);
                break;
            case 3:
                old_value *= Math.exp(1);
                break;
            case 4:
                old_value *= Math.exp(0.1);
                break;
            case 5:
                old_value *= 2;
                break;
            case 6:
                old_value *= Math.pow(2, 0.1);
                break;
            case 7:
                old_value += 1000;
                break;
            case 8:
                old_value += 100;
                break;
            case 9:
                old_value += 10;
                break;
            case 10:
                old_value += 1;
                break;
            case 11:
                old_value += 0.1;
                break;
            case 12:
                old_value += 0.01;
                break;
            case 13:
                old_value += 0.001;
                break;
        }
        return old_value;
    }

	
   $.each($('#checkboxspinnermenu'+cbs_id).children().find('a'),
	function(index, value){
		$(value).click(
			function(){
				spinmode(index);
			});
	});

    var spinner= 10;
	var my_spin_mode=10;
    var spinner_default_value = $(this)[0].value;
    var spinner_last_nondefault = $(this)[0].value;
    function spinmode(i) {
        my_spin_mode = i;
	}
    function update_spinner_checkbox(spinner_id) {
        var same = Number($('#' + spinner_id)[0].value) == spinner_default_value;
        if (same) {
            $('#spinnercheckbox' + cbs_id).prop('src', 'powerspinner/checkbox0.png');
        } else {
            $('#spinnercheckbox' + cbs_id).prop('src', 'powerspinner/checkbox1.png');
        }
        if (!same) {
            spinner_last_nondefault = $('#' + spinner_id)[0].value;
        }
    }
    function Make_Power_Spinner(spinner_id) {
        $('#checkboxspinnermenu'+cbs_id).menu();
        spinner = $('#' + spinner_id).spinner({
            spin: function (event, ui) {
                event.preventDefault();
                if (event.which == 3) {
                    // if a menu is open, then close it
                    if ($.fn.PowerSpinner.open_menu != undefined) {
                        $.fn.PowerSpinner.open_menu.hide();
                    }
                    var menu = $('#checkboxspinnermenu'+cbs_id).show().position({
                        my: 'left top',
                        at: 'right bottom',
                        of: this
                    });
                    $.fn.PowerSpinner.open_menu = menu;
                    $(document).on('click', function () {
                        menu.hide();
                        $.fn.PowerSpinner.open_menu = undefined;
                    });
                } else if (event.which == 1) {
                    var new_value = ui.value;
                    var old_value = Number($('#' + spinner_id)[0].value);
                    if (new_value > old_value) {
                        $('#' + spinner_id)[0].value = do_increment(old_value, my_spin_mode);
                    } else {
                        $('#' + spinner_id)[0].value = do_decrement(old_value, my_spin_mode);
                    }
                }
                update_spinner_checkbox(spinner_id);
            }
        });

        $('#' + spinner_id).longpress(function () { alert('longclick') });

        // add the checkbox
        $('#' + spinner_id).parent().prepend('&nbsp;<a><img src="powerspinner/checkbox0.png" id="spinnercheckbox' + cbs_id + '" title="Click to toggle between default and non-default values; right-click to change the default." height="18px" width="18px" style="margin-bottom:-3px"/></a>');
        function prompt_to_update_default() {
            if (Number($('#' + spinner_id)[0].value) == spinner_default_value) return;
            $('#spinnerchangeconfirm').html('Permanently replace default value of ' + spinner_default_value + ' with ' + Number($('#' + spinner_id)[0].value) + '?');
            $('#spinnerchangeconfirm').dialog({
                resizable: false,
                modal: true,
                buttons: {
                    'Replace': function () {
                        replace_spinner_value();
                        $(this).dialog('close');
                    },
                    'Cancel': function () {
                        $(this).dialog('close');
                    }
                }
            });
        }
        function replace_spinner_value() {
            spinner_default_value = Number($('#' + spinner_id)[0].value);
            update_spinner_checkbox(spinner_id);
        }
        $('#spinnercheckbox' + cbs_id).parent().bind('contextmenu', function (event) {
            event.preventDefault();
            prompt_to_update_default();
        });
        $('#spinnercheckbox' + cbs_id).longpress(prompt_to_update_default);
        $('#spinnercheckbox' + cbs_id).parent().click(function (event) {
            if (event.which == 1) {
                if ($('#' + spinner_id)[0].value == spinner_default_value) {
                    $('#' + spinner_id)[0].value = spinner_last_nondefault;
                } else {
                    spinner_last_nondefault = $('#' + spinner_id)[0].value;
                    $('#' + spinner_id)[0].value = spinner_default_value;
                }
            } else {
                if (event.which == 3) {
                    console.log('should never get here');
                    prompt_to_update_default();
                }
            }
            update_spinner_checkbox(spinner_id);
        });

        // make sure the checkbox is updated when keys are pressed
        $('#' + spinner_id).on('keydown', function(e) {
            if (e.keyCode == 38) {
                // up
                var old_value = Number($('#' + spinner_id)[0].value);
                $('#' + spinner_id)[0].value = do_increment(old_value, my_spin_mode);
                update_spinner_checkbox(spinner_id);
                return false;
            } else if (e.keyCode == 40) {
                // down
                var old_value = Number($('#' + spinner_id)[0].value);
                $('#' + spinner_id)[0].value = do_decrement(old_value, my_spin_mode);
                update_spinner_checkbox(spinner_id);
                return false;
            } else {       
                update_spinner_checkbox(spinner_id);
            }
        });
        $('#' + spinner_id).on('keyup', function() {update_spinner_checkbox(spinner_id);});

        // disable context menu on spinner buttons and checkboxspinnermenu
        $('.ui-spinner-button').bind('contextmenu', function () { return false; });
        $('#checkboxspinnermenu').bind('contextmenu', function () { return false; });

        // hover for arrows
        $('.ui-spinner-button').prop('title', 'Click to change value; right-click to change increment/decrement method.');
    };
    if (cbs_id == 0) {
        // place for confirm modal dialog
        $('body').append("<div style='display: none;' id='spinnerchangeconfirm'>Permanently replace default value WHATEVER with WHATEVER?</div>");
    }
	$(this).spinner();
    Make_Power_Spinner($(this).attr('id'));
};

$.fn.PowerSpinner.spinner_id = 0;
$.fn.PowerSpinner.open_menu = undefined;
