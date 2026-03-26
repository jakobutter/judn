        const countdownDate = new Date("March 28, 2026 00:00:00").getTime();

        const countdownFunction = setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("countdown").innerHTML = 
              "<strong>" + days + ":" + hours + ":" + minutes + ":" + seconds + "</strong>&nbsp—&nbspWeird Squad";

            if (distance < 0) {
                clearInterval(countdownFunction);
                document.getElementById("countdown").innerHTML = "<strong>20260328</strong>&nbsp—&nbspWeird Squad";
            }
        }, 1000);