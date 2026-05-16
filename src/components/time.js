
var epoch = 1731081990;

function incrementEpoch() {
		updateClock();
		$('.epoch').html(epoch++);
}

function updateClock() {
		var now = moment(),
				second = now.seconds() * 6,
				minute = now.minutes() * 6 + second / 60,
				hour = ((now.hours() % 12) / 12) * 360 + 90 + minute / 12;
		
		// $('#hour').css("transform", "rotate(" + hour + "deg)");
		// $('#minute').css("transform", "rotate(" + minute + "deg)");
		// $('#second').css("transform", "rotate(" + second + "deg)");					
	
		$('#hour1').html(((now.hours() == 0 || now.hours() == 12) ? 12 : now.hours() % 12));
		$('#minute1').html(now.minutes().toString().length === 1 ? '0'+now.minutes(): now.minutes());
		$('#second1').html(now.seconds().toString().length === 1 ? '0'+now.seconds(): now.seconds()).append(now.format(' A'));		
}

function ConvertTime(fields){
	if(fields == 'timestamp'){
		var timestamp = getTimeStamp();
		if(!timestamp) 
			return;
		$('.timestamp-results').show();
		$('.timestamp-results .gmt').html(moment(timestamp).utc().toString());
		$('.timestamp-results .local').html(moment(timestamp).toDate());
		$('.timestamp-results .relative').html(moment(timestamp).fromNow());
	}
	else if(fields == 'entry'){
		$('.entry-results').show();
		var time = moment([
			parseInt($('#y').val(),10), 
			parseInt($('#m').val(),10)-1,  
			parseInt($('#d').val(),10),  
			parseInt($('#hours').val(),10),  
			parseInt($('#min').val(),10), 
			parseInt($('#sec').val(),10), 
			0
		]);
		$('.entry-results .unix').html(moment(time).unix());
		$('.entry-results .gmt').html(moment(time).utc().toString());
		$('.entry-results .local').html(moment(time).toDate());
		$('.entry-results .relative').html(moment(time).fromNow());
	}
}

function getTimeStamp(){
	var timestamp = $('#timestamp').val();
		$('.ui.negative.message').hide();
		if ((timestamp >= 10E7) && (timestamp < 18E7)) {
				$('.ui.negative.message').html("Expected a more recent date? You are missing 1 digit.").show();
				return false;
    }
    if ((timestamp >= 1E16) || (timestamp <= -1E16)) {
				$('.timestamp-results .format').html("Nanoseconds (1 billionth of a second)");
        timestamp = Math.floor(timestamp / 1000000);
    } else if ((timestamp >= 1E14) || (timestamp <= -1E14)) {
				$('.timestamp-results .format').html("Microseconds (1/1,000,000 second)");
        timestamp = Math.floor(timestamp / 1000);
    } else if ((timestamp >= 1E11) || (timestamp <= -3E10)) {
				$('.timestamp-results .format').html("Milliseconds (1/1,000 second)");
    } else {
				$('.timestamp-results .format').html("Seconds");
        if ((timestamp > 1E11) || (timestamp < -1E10)) {
						$('.ui.negative.message').html("Remove the last 3 digits if you are trying to convert milliseconds.").show();
        }
        timestamp = (timestamp * 1000);
    }
    if (timestamp < -68572224E5) {
				$('.ui.negative.message').html("Dates before 14 september 1752 (pre-Gregorian calendar) are not accurate.").show();
				return false;
		}
		return parseInt(timestamp, 10);
}

document.addEventListener('DOMContentLoaded', function(){
$(document).ready(function(){
	setInterval(incrementEpoch, 1000);	
	
	$('#timestamp').on('keyup', function(event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			ConvertTime('timestamp');
		}
	}); 
	$('.entry-inputs').on('keyup', function(event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			ConvertTime('entry');
		}
	}); 
});		    
});