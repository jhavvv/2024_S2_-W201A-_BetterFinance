import React, { useState } from 'react';
import './custom.css';

function Slideshow() {
    const [slideIndex, setSlideIndex] = useState(1);

    const showSlides = (n) => {
        const slides = document.getElementsByClassName('mySlides');
        if (n > slides.length) setSlideIndex(1);
        if (n < 1) setSlideIndex(slides.length);
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = 'none';
        }
        slides[slideIndex - 1].style.display = 'block';
    };

    const plusSlides = (n) => {
        showSlides(slideIndex + n);
    };

    React.useEffect(() => {
        showSlides(slideIndex);
    }, [slideIndex]);

    return (
        <div className="slideshow-container">
            <div className="mySlides">
                <div className="numbertext">1 / 6</div>
                <img src="path/to/1tim.jpg" alt="Slide 1" />
            </div>
            {/* Add other slides here */}
            <a className="prev" onClick={() => plusSlides(-1)}>&#10094;</a>
            <a className="next" onClick={() => plusSlides(1)}>&#10095;</a>
        </div>
    );
}

export default Slideshow;
