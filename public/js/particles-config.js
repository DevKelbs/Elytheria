particlesJS("particles-js", {
    particles: {
        number: {
            value: 50,
            density: {
                enable: true,
                value_area: 800,
            },
        },
        color: {
            value: ["#ffc300", "#d1a408", "#8c4b2f", "#e6d8b6"],
        },
        shape: {
            type: "circle",
        },
        opacity: {
            value: 0.85,
            random: true,
            anim: {
                enable: true,
                speed: 0.5,
                opacity_min: 0.1,
                sync: false,
            },
        },
        size: {
            value: 2,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                size_min: 0.5,
                sync: false,
            },
        },
        line_linked: {
            enable: false,
        },
        move: {
            enable: true,
            speed: 1,
            direction: "top",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
                enable: false,
            },
        },
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "bubble",
            },
            onclick: {
                enable: true,
                mode: "repulse",
            },
            resize: true,
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 1,
                },
            },
            bubble: {
                distance: 100,
                size: 5,
                duration: 1,
                opacity: 0.5,
                speed: 1,
            },
            repulse: {
                distance: 50,
                duration: 0.4,
            },
            push: {
                particles_nb: 4,
            },
            remove: {
                particles_nb: 2,
            },
        },
    },
    retina_detect: true,
});
