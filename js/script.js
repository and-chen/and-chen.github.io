"use strict";
const setButtonLeftAttr = (value) => {
	const buttonGroup = document.querySelector('.button-group');
	buttonGroup.dataset.left = value;
};
const buttonClick = (value) => {
	setButtonLeftAttr(value);
};

async function fetchData() {
	try {
		const res = await fetch('https://opensheet.vercel.app/1cYBTi7GOrFPNp4_ikh7WjNGKY4pbTCGq1dBln8KyzYg/Log+Details');
		const data = await res.json();
		return data;
	} catch (error) {
		console.error(error);
	}
}

async function renderData() {
	const data = await fetchData();
	// console.log(data);

	// trim data
	var participants = {};
	for (var i = 0; i < data.length; i++) {
		var cur_obj = data[i];

		Object.keys(cur_obj).forEach(function (key) {
			if (key.length <= 0 || key.indexOf("Streak") >= 0) {
				delete cur_obj[key];
			}

			if (key === "Me") {
				cur_obj['Peter Wang'] = cur_obj[key];
				delete cur_obj[key];
			}
		});
	}

	// parse data into participants json
	var participants = [];
	for (var i = 0; i < data.length; i++) {
		var cur_obj = data[i];

		if (i === 0) {
			Object.keys(cur_obj).forEach(function (key) {
				if (key !== 'Date') {
					var participant = {};
					participant.name = key;
					participant.data = [];
					participant.total = 0;
					participant.streak = 0;
					participant.read = 0;
					participant.rate = 0.0;

					participants.push(participant);
				}
			});

		}

		Object.keys(cur_obj).forEach(function (key) {
			for (var j = 0; j < participants.length; j++) {
				if (participants[j].name == key) {
					participants[j].data.push(cur_obj[key])
				}
			}
		});

	}

	// parse participant's data
	for (var i = 0; i < participants.length; i++) {
		var participant = participants[i];

		var count = 0;
		var streak = 0;
		var max_streak = 0;

		var pdata = participant.data;
		for (var j = 0; j < pdata.length; j++) {
			if (pdata[j] !== "") {
				count++;
				streak++;
				if (streak > max_streak) {
					max_streak = streak;
				}
			} else {
				streak = 0;
			}
		}

		participant.read = count;
		participant.streak = max_streak;
		participant.total = count + max_streak;
	}

	// sort the participants' total score
	participants.sort(function (a, b) {
		return b.total - a.total;
	});

	// console.log(participants);

	// render the sorted participants' data
	
	var score_card = document.getElementsByClassName("score-card");
	for (var i = 0; i < participants.length; i++) {
		var participant = participants[i];

		var leader = createLeaderElement(i, participant);

		score_card[0].appendChild(leader);
	}
}

function createLeaderElement(pos, participant) {
	var trophy_colors = ["#D4AF37", "#C0C0C0", "#9F7A34"];

	// 	<div class="user">
	// 		<div class="number">1</div>
	// 		<div class="user-pic d-flex justify-content-center align-items-center">
	// 			<i class="bi bi-trophy-fill" style="color: #D4AF37;"></i>
	// 		</div>
	// 	</div>
	var number = document.createElement("div");
	number.classList.add("number");
	number.innerHTML = "" + (pos + 1);

	var user_pic = document.createElement("div");
	if (pos < 3) {
		user_pic.classList.add("user-pic", "d-flex", "justify-content-center", "align-items-center");

		var ii = document.createElement("i");
		ii.classList.add("bi", "bi-trophy-fill");
		ii.style.color = trophy_colors[pos];

		user_pic.appendChild(ii);
	} else {
		user_pic.classList.add("no-crown", "d-flex", "justify-content-center", "align-items-center");
	}

	var user = document.createElement("div");
	user.classList.add("user");
	user.appendChild(number);
	user.appendChild(user_pic);

	// 	<div class="user-info">
	// 		<div class="user-name">Peter Wang</div>
	// 		<div class="view-count">Total Points: 114</div>
	// 	</div>
	var user_name = document.createElement("div");
	user_name.classList.add("user-name");
	user_name.innerHTML = participant.name;

	var view_count = document.createElement("div");
	view_count.classList.add("view-count");
	view_count.innerHTML = "Total Points: " + participant.total;

	var user_info = document.createElement("div");
	user_info.classList.add("user-info");
	user_info.appendChild(user_name);
	user_info.appendChild(view_count);

	// 	<div class="gallery text-center">
	// 		<div class="gallery-item">Streak<br>7</div>
	// 		<div class="gallery-item">Read<br>7</div>
	// 		<div class="gallery-item">Rate<br>7</div>
	// 	</div>
	var gallery = document.createElement("div");
	gallery.classList.add("gallery", "text-center");
	var gallery_item = document.createElement("div");
	gallery_item.classList.add("gallery-item");
	gallery_item.innerHTML = "Streak<br>\n" + participant.streak;
	gallery.appendChild(gallery_item);
	gallery_item = document.createElement("div");
	gallery_item.classList.add("gallery-item");
	gallery_item.innerHTML = "Read<br>\n" + participant.read;
	gallery.appendChild(gallery_item);
	gallery_item = document.createElement("div");
	gallery_item.classList.add("gallery-item");
	gallery_item.innerHTML = "Rate<br>\n" + participant.rate;
	gallery.appendChild(gallery_item);

	var leader = document.createElement("div");
	leader.classList.add("leader");
	leader.appendChild(user);
	leader.appendChild(user_info);
	leader.appendChild(gallery);

	return leader;
}

renderData();


