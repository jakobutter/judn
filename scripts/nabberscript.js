
    <script>
		let extension = 1;
		let videoTitle = '';
		let videoUrl = '';
		let youtubeId = '';
		let videoQuality = '';
		let videoServerPath = '';
		let formatValue = 1;
		let audioQuality = 4;
		
		let videoData = {
			check_database: {
				youtube_id: youtubeId,
				quality: formatValue === 1 ? audioQuality : videoQuality,
			},
			get_video_data: {
				url: videoUrl
			},
			download_video: {
				url: videoUrl,
				quality: formatValue === 1 ? audioQuality : videoQuality,
				title: videoTitle,
				formatValue: formatValue,
			},
			insert_to_database: {
				youtube_id: youtubeId,
				server_path: videoServerPath,
				quality: formatValue === 1 ? audioQuality : videoQuality,
				title: videoTitle,
				formatValue: formatValue,
			}
		}
		
		let starting_data = {
			url: videoUrl,
			downloadMode: 'audio',
			filenameStyle: 'basic',
			audioBitrate: '96',
		};
		
		function getYouTubeVideoId(url) {
		  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|embed|watch|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[&?]|$)/;
		  const match = url.match(regex);

		  return match ? match[1] : null;
		}

		function showFullVideoInfo() {
			const videoInfo = document.getElementById("video-info");
			const videoTitle = document.getElementById("video-title");
			const secondaryMessage = document.getElementById("secondary-message");
			const buttonRow = document.querySelector(".button-row");
			// const donateButton = document.querySelector(".donate-btn");

			videoInfo.style.display = "block";      // Show entire video-info section
			videoTitle.style.display = "block";     // Show the first h1
			secondaryMessage.style.display = "none"; // Hide the second h1
			buttonRow.style.display = "flex";       // Show the button row
			// donateButton.style.display = "flex";	// SHow the donate button
		}

		function showMinimalVideoInfo() {
			const videoInfo = document.getElementById("video-info");
			const videoTitle = document.getElementById("video-title");
			const secondaryMessage = document.getElementById("secondary-message");
			const buttonRow = document.querySelector(".button-row");
			// const donateButton = document.querySelector(".donate-btn");

			videoInfo.style.display = "block";      // Show entire video-info section
			videoTitle.style.display = "none";      // Hide the first h1
			secondaryMessage.style.display = "block"; // Show the second h1
			buttonRow.style.display = "flex";       // Hide the button row
			// donateButton.style.display = "none";	// Hide the donation button
		}
		
		function getAudioQuality(audioQuality) {
			switch (audioQuality) {
				case 320:
					return 0;
				case 256:
					return 1;
				case 128:
					return 4;
				case 96:
					return 5;
				default:
					return 4; // Default case for any other value
			}
		}

		function checkDatabase(data, retries = 0) {
			fetch('check_database.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(response => response.json())
			.then(data => {
				if (data.error) {
					getVideoData(videoData.get_video_data)
				} else {
					const downloadUrl = data.data.server_path;

					document.getElementById('form-container').style.display = 'none';
					document.getElementById('spinner').style.display = 'none';
					showFullVideoInfo();

					// Automatically download the file
					const a = document.createElement('a');
					a.href = downloadUrl;
					a.download = 'downloaded_file.mp3';
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					//console.log(data)
				}
			})
			.catch(error => {
				console.error('Error:', error);
			});
		}

		function getVideoData(data, retries = 0) {
			fetch('get_video_data.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(response => response.json())
			.then(data => {
				if (data.error) {
					alert('Error: ' + data.error);
				} else {
					videoData.download_video.title = data.title;
					videoData.insert_to_database.title = data.title;
					document.querySelector('#spinner span').textContent = 'Converting...';
					downloadVideo(videoData.download_video);
				}
			})
			.catch(error => {
				console.error('Error:', error);
			});
		}

		function downloadVideo(data, retries = 0) {
			fetch('download_video.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(response => response.json())
			.then(data => {
				if (data.error && data.errorType == 4) {
					document.getElementById('form-container').style.display = 'none';
					document.getElementById('spinner').style.display = 'none';
					showMinimalVideoInfo();
				} else if (data.error && data.errorType != 4) {
						alert('Error: ' + data.error);
				} else {
					const downloadUrl = data.download_link.replace(/&/g, '%26').replace(/#/g, '%23');

					document.getElementById('form-container').style.display = 'none';
					document.getElementById('spinner').style.display = 'none';
					showFullVideoInfo();

					// Automatically download the file
					const a = document.createElement('a');
					console.log(downloadUrl)
					a.href = downloadUrl;
					a.download = 'downloaded_file.mp3';
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					//console.log(data)

					videoData.insert_to_database.server_path = data.download_link;

					insertToDatabase(videoData.insert_to_database);
				}
			})
			.catch(error => {
				console.error('Error:', error);
			});
		}

		function insertToDatabase(data, retries = 0) {
			fetch('insert_to_database.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(response => response.json())
			.then(data => {
				if (data.error) {
					alert('Error: ' + data.error);
				} else {
					console.log('success');
				}
			})
			.catch(error => {
				console.error('Error:', error);
			});
		}
		
		
		function fetchData(data, retries = 0) {
			fetch('fetch.php', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(response => response.json())
			.then(data => {
				if (data.error) {
					console.log('Error: ' + data.error);
					alert('Error: ' + data.error);
				} else if (data["status"] == "rate-limit") {
					if (retries < 15) {
						document.getElementById('spinner').style.display = 'block';
						// Retry after 15 seconds if rate limit is hit, and increment the retry counter
						setTimeout(() => {
							fetchData(starting_data, retries + 1);
						}, 2000); // 1 second delay
						console.log(`There was an error, trying again... Attempt ${retries}`);
					} else {
						// If it has been retried 15 times, show the alert
						alert('Too many requests, try again in 5 seconds');
						location.reload();
					}
				} else {
					const downloadUrl = data.url;

					document.getElementById('form-container').style.display = 'none';
					document.getElementById('video-info').style.display = 'block';
					document.getElementById('spinner').style.display = 'none';

					// Automatically download the file
					const a = document.createElement('a');
					a.href = downloadUrl;
					a.download = 'downloaded_file.mp3';
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					//console.log(data)
				}
			})
			.catch(error => {
				console.error('Error:', error);
			});
		}
		
		document.getElementById('convert-button').addEventListener('click', function() {
			videoUrl = document.getElementById('video-url').value;
			
			if (!videoUrl) {
				alert('Please enter a video URL');
				return;
			}
			
			youtubeId = getYouTubeVideoId(videoUrl);
			
			youtubeVideoUrl = "https://www.youtube.com/watch?v=" + youtubeId;
			
			
			audioQuality = document.getElementById('quality-audio-select-display-value').textContent;
			videoQuality = document.getElementById('quality-video-select-display-value').textContent;
			// Select the label element
			youtubeLabel = document.querySelector('label.social-button-container.youtube.active');

			// Check if it has both classes
			isYoutubeActive = youtubeLabel && youtubeLabel.classList.contains('youtube') && youtubeLabel.classList.contains('active');
			
			starting_data.url = videoUrl;
			starting_data.downloadMode = extension === 1 ? 'audio' : 'auto',
			
			videoData.check_database.youtube_id = youtubeId;
			videoData.get_video_data.url = youtubeVideoUrl;
			videoData.download_video.url = youtubeVideoUrl;
			videoData.insert_to_database.youtube_id = youtubeId;
			
			
			document.getElementsByClassName('converter-button-container')[0].style.pointerEvents = 'none';
			document.getElementsByClassName('converter-button-container')[0].style.opacity = 0.5;

			formatValue = parseInt(document.querySelector('.format-select-options.active').getAttribute('data-format'));
			
			videoData.check_database.formatValue = formatValue;
			videoData.download_video.formatValue = formatValue;
			videoData.insert_to_database.formatValue = formatValue;
			
			
			if (formatValue === 0 && isYoutubeActive) {
				videoQuality = parseInt(videoQuality.replace("p", ""), 10);

				// Compare and limit the quality to 1080 if it’s higher
				videoQuality = videoQuality > 1080 ? 1080 : videoQuality;
				
				videoData.check_database.quality = videoQuality;
				
				videoData.download_video.quality = videoQuality;
				
				videoData.insert_to_database.quality = videoQuality;
				// Call fetchData with the initial data and starting retries count of 0
				console.log(videoData.insert_to_database.formatValue)
				checkDatabase(videoData.check_database);
				document.getElementById('spinner').style.display = 'flex';
			} else if (formatValue === 1 && isYoutubeActive) {
				audioQuality = parseInt(audioQuality.replace("kb/s", ""), 10);
				
				audioQuality = getAudioQuality(audioQuality)
				
				videoData.check_database.quality = audioQuality;
				
				videoData.download_video.quality = audioQuality;
				
				videoData.insert_to_database.quality = audioQuality;
				// Call fetchData with the initial data and starting retries count of 0
				console.log(videoData.insert_to_database.formatValue)
				checkDatabase(videoData.check_database);
				document.getElementById('spinner').style.display = 'flex';
			} else {
				fetchData(starting_data);
			} 
		});
		
		document.querySelectorAll('.social-button-container').forEach(button => {
			button.addEventListener('click', function() {
				// Remove 'active' class from all buttons
				document.querySelectorAll('.social-button-container').forEach(btn => {
					btn.classList.remove('active');
				});

				// Add 'active' class to the clicked button
				this.classList.add('active');

				// Hide all social-input fields
				document.querySelectorAll('[class^="social-input-"]').forEach(input => {
					input.style.display = 'none';
				});

				// Hide all content-second sections
				document.querySelectorAll('[class^="content-second-"]').forEach(section => {
					section.style.display = 'none';
				});

				// Show the corresponding social-input field
				const inputClass = `.social-input-${this.classList[1]}`;
				const inputElement = document.querySelector(inputClass);
				if (inputElement) {
					inputElement.style.display = 'block';
				}

				// Show the corresponding content-second section
				const sectionClass = `.content-second-${this.classList[1]}`;
				const sectionElement = document.querySelector(sectionClass);
				if (sectionElement) {
					sectionElement.style.display = 'block';
				}

				// Set the format-select-options based on the clicked button
				const formatOptions = document.querySelectorAll('.format-select-options');
				formatOptions.forEach(option => {
					option.classList.remove('active');
				});

				if (this.classList.contains('youtube')) {
					document.querySelector('.format-select-options[data-format="1"]').classList.add('active');
					document.getElementById('format-select-display-value').textContent = 'MP3';
					audioBox = document.querySelector(".quality-audio-select-box");
					videoBox = document.querySelector(".quality-video-select-box");
					audioInputText = document.querySelector("#quality-audio-input-text");
					videoInputText = document.querySelector("#quality-video-input-text");
					imageElement = document.getElementById('website-image');
					currentSrc = imageElement.src;
					imageElement.src = currentSrc.replace("/img/cnvmp4", "/img/cnvmp3");
					
					audioBox.style.display = "block";
					videoBox.style.display = "none";
					audioInputText.style.display = "block";
					videoInputText.style.display = "none";
				} else {
					document.querySelector('.format-select-options[data-format="0"]').classList.add('active');
					document.getElementById('format-select-display-value').textContent = 'MP4';
					audioBox = document.querySelector(".quality-audio-select-box");
					videoBox = document.querySelector(".quality-video-select-box");
					audioInputText = document.querySelector("#quality-audio-input-text");
					videoInputText = document.querySelector("#quality-video-input-text");
					imageElement = document.getElementById('website-image');
					currentSrc = imageElement.src;
					imageElement.src = currentSrc.replace("/img/cnvmp3", "/img/cnvmp4");
					
					audioBox.style.display = "none";
					videoBox.style.display = "none";
					audioInputText.style.display = "none";
					videoInputText.style.display = "none";
					extension = 0
				}
			});
		});
		
		document.addEventListener('DOMContentLoaded', function () {
			const body = document.body;
			const button = document.getElementById('theme-button');
			const img = document.getElementById('website-image');

			// Load the saved theme from localStorage
			const savedTheme = localStorage.getItem('theme');
			if (savedTheme) {
				body.classList.add(savedTheme);
				updateTheme(savedTheme);
			}

			// Toggle theme and cache the selection
			button.addEventListener('click', function () {
				body.classList.toggle('light-theme');
				const theme = body.classList.contains('light-theme') ? 'light-theme' : 'dark-theme';
				localStorage.setItem('theme', theme);
				updateTheme(theme);
			});

			// Update theme-related elements
			function updateTheme(theme) {
				formatValue = parseInt(document.querySelector('.format-select-options.active').getAttribute('data-format'));
			
				let format = formatValue === 1 ? 'mp3' : 'mp4';

				// Set the image source based on theme and format
				if (theme === 'light-theme') {
					img.src = `/img/cnv${format}.png`; // Light theme image path
					button.textContent = 'Light Theme';
				} else {
					img.src = `/img/cnv${format}-black.png`; // Dark theme image path
					button.textContent = 'Dark Theme';
				}
			}
		});
		
		document.getElementById('format-select-display').addEventListener('click', function(event) {
			var formatSelectList = document.getElementById('format-select-list');
			if (formatSelectList.style.display === 'none' || formatSelectList.style.display === '') {
				formatSelectList.style.display = 'block';
			} else {
				formatSelectList.style.display = 'none';
			}
			event.stopPropagation(); // Prevent the event from propagating to the document listener
		});

		document.addEventListener('click', function(event) {
			var formatSelectList = document.getElementById('format-select-list');
			if (formatSelectList.style.display === 'block') {
				formatSelectList.style.display = 'none';
			}
		});

		document.querySelectorAll('.format-select-options').forEach(option => {
			option.addEventListener('click', function() {
				// Remove 'active' class from all options and add it to the selected option
				document.querySelectorAll('.format-select-options').forEach(opt => opt.classList.remove('active'));
				this.classList.add('active');

				// Update display text with the selected format
				const formatText = this.textContent;
				document.getElementById('format-select-display-value').textContent = formatText;
				
				// Hide the options list
				document.getElementById('format-select-list').style.display = 'none';

				// Retrieve the selected format value
				const formatValue = parseInt(this.getAttribute('data-format'));
				
				// Select the label element
				youtubeLabel = document.querySelector('label.social-button-container.youtube.active');

				// Check if it has both classes
				isYoutubeActive = youtubeLabel && youtubeLabel.classList.contains('youtube') && youtubeLabel.classList.contains('active');

				// Perform actions based on selected format
				if (formatValue === 1 && isYoutubeActive) {
					audioBox = document.querySelector(".quality-audio-select-box");
					videoBox = document.querySelector(".quality-video-select-box");
					audioInputText = document.querySelector("#quality-audio-input-text");
					videoInputText = document.querySelector("#quality-video-input-text");
					imageElement = document.getElementById('website-image');
					currentSrc = imageElement.src;
					imageElement.src = currentSrc.replace("/img/cnvmp4", "/img/cnvmp3");
					
					audioBox.style.display = "block";
					videoBox.style.display = "none";
					audioInputText.style.display = "block";
					videoInputText.style.display = "none";
				} else if (formatValue === 0 && isYoutubeActive) {
					audioBox = document.querySelector(".quality-audio-select-box");
					videoBox = document.querySelector(".quality-video-select-box");
					audioInputText = document.querySelector("#quality-audio-input-text");
					videoInputText = document.querySelector("#quality-video-input-text");
					imageElement = document.getElementById('website-image');
					currentSrc = imageElement.src;

					imageElement.src = currentSrc.replace("/img/cnvmp3", "/img/cnvmp4");
					audioBox.style.display = "none";
					videoBox.style.display = "block";
					audioInputText.style.display = "none";
					videoInputText.style.display = "block";
				} else if (formatValue === 1 && !isYoutubeActive) {
					audioBox = document.querySelector(".quality-audio-select-box");
					videoBox = document.querySelector(".quality-video-select-box");
					audioInputText = document.querySelector("#quality-audio-input-text");
					videoInputText = document.querySelector("#quality-video-input-text");
					imageElement = document.getElementById('website-image');
					currentSrc = imageElement.src;
					imageElement.src = currentSrc.replace("/img/cnvmp4", "/img/cnvmp3");
					
					audioBox.style.display = "none";
					videoBox.style.display = "none";
					audioInputText.style.display = "none";
					videoInputText.style.display = "none";
					
					extension = 1
				} else if (formatValue === 0 && !isYoutubeActive) {
					audioBox = document.querySelector(".quality-audio-select-box");
					videoBox = document.querySelector(".quality-video-select-box");
					audioInputText = document.querySelector("#quality-audio-input-text");
					videoInputText = document.querySelector("#quality-video-input-text");
					imageElement = document.getElementById('website-image');
					currentSrc = imageElement.src;

					imageElement.src = currentSrc.replace("/img/cnvmp3", "/img/cnvmp4");
					audioBox.style.display = "none";
					videoBox.style.display = "none";
					audioInputText.style.display = "none";
					videoInputText.style.display = "none";
					
					extension = 0
				}
			});
		});
		
		document.getElementById('quality-audio-select-display').addEventListener('click', function(event) {
			var qualitySelectList = document.getElementById('quality-audio-select-list');
			if (qualitySelectList.style.display === 'none' || qualitySelectList.style.display === '') {
				qualitySelectList.style.display = 'block';
			} else {
				qualitySelectList.style.display = 'none';
			}
			event.stopPropagation(); // Prevent the event from propagating to the document listener
		});

		document.addEventListener('click', function(event) {
			var qualitySelectList = document.getElementById('quality-audio-select-list');
			if (qualitySelectList.style.display === 'block') {
				qualitySelectList.style.display = 'none';
			}
		});

		document.querySelectorAll('.quality-audio-select-options').forEach(option => {
			option.addEventListener('click', function() {
				document.querySelectorAll('.quality-audio-select-options').forEach(opt => opt.classList.remove('active'));
				this.classList.add('active');
				const qualityText = this.textContent;
				document.getElementById('quality-audio-select-display-value').textContent = qualityText;
				document.getElementById('quality-audio-select-list').classList.add('hidden');

				// Update the quality value based on the selected option's ID
				const selectedQuality = this.getAttribute('id').split('-').pop();
				quality = parseInt(selectedQuality);
			});
		});
		
		document.getElementById('quality-video-select-display').addEventListener('click', function(event) {
			var qualitySelectList = document.getElementById('quality-video-select-list');
			if (qualitySelectList.style.display === 'none' || qualitySelectList.style.display === '') {
				qualitySelectList.style.display = 'block';
			} else {
				qualitySelectList.style.display = 'none';
			}
			event.stopPropagation(); // Prevent the event from propagating to the document listener
		});

		document.addEventListener('click', function(event) {
			var qualitySelectList = document.getElementById('quality-video-select-list');
			if (qualitySelectList.style.display === 'block') {
				qualitySelectList.style.display = 'none';
			}
		});

		document.querySelectorAll('.quality-video-select-options').forEach(option => {
			option.addEventListener('click', function() {
				document.querySelectorAll('.quality-video-select-options').forEach(opt => opt.classList.remove('active'));
				this.classList.add('active');
				const qualityText = this.textContent;
				document.getElementById('quality-video-select-display-value').textContent = qualityText;
				document.getElementById('quality-video-select-list').classList.add('hidden');

				// Update the quality value based on the selected option's ID
				const selectedQuality = this.getAttribute('id').split('-').pop();
				quality = parseInt(selectedQuality);
			});
		});
    </script>
