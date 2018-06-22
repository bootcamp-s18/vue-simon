Vue.component('timer', {

	template: `<div id="status">
		<p>{{ message }}{{ remaining }}</p>
	</div>`,

	data() {
		return {
			message: 'Click the Start button to begin!',
			remaining: '',
			intervalId: null
		}
	},

	created() {

		var self = this;

		this.$parent.$on('stateChange', function($event) {

			switch($event) {
			
				case 'capturing': 
					self.startTimer();
					break;

				case 'processing':
					self.stopTimer('Yikes! You tapped a light!');
					self.startTimer();
					break;
			
				default:
					console.log("Timer: state changed to [" + $event + "]");
			
			}

		});
	},

	methods: {

		startTimer: function() {
			if (this.intervalId === null) {
				this.remaining = 10;
				this.message = '';
				this.intervalId = window.setInterval(this.tick, 1000);
			}
		},

		stopTimer: function(text) {
			window.clearInterval(this.intervalId);
			this.message = text;
			this.remaining = '';
			this.intervalId = null;
		},

		tick: function() {
			console.log('Tick!');
			this.remaining--;
			if (this.remaining === 0) {
				this.stopTimer('Time expired!');
			} 
		}

	}

});

var simon = new Vue({

	el: '#app',

	data: {
		longest: 0,
		current: 0,
		isTimerActive: false,
		sequence: [ 'red', 'yellow', 'green', 'green', 'blue' ],
		taps: [],
		playSequenceId: null,
		currentButton: '',
		playSequenceCounter: 0
	},

	methods: {

		start: function() {
			this.isTimerActive = true;
			this.playSequence();
			this.$emit('stateChange', 'capturing');
		},

		captureTap(color) {

			if (this.isTimerActive) {

				// Yay! Process this tap!
				this.$emit('stateChange', 'processing');

			}
			else {
				// Not waiting for user input
				// Ignore the tap
			}


			// push to an array?

			// light up the button

			// emit another event
		},

		playSequence: function() {

			var self = this;

			self.playSequenceId = window.setInterval(function() {

				self.currentButton = self.sequence[self.playSequenceCounter];

				setTimeout(function() {
					self.currentButton = '';
					self.playSequenceCounter++;
					if (self.playSequenceCounter === self.sequence.length) {

						// Turn off the repeat
						console.log("Ran out of sequence to display");
						window.clearInterval(self.playSequenceId);

					}

				}, 300);

			}, 600);



		}

	}


});