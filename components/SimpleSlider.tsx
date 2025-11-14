"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Image from "next/image";

interface SimpleSliderProps {
  children: React.ReactNode;
  dots?: boolean;
  infinite?: boolean;
  speed?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  pauseOnHover?: boolean;
  fade?: boolean;
  arrows?: boolean;
  prevArrow?: React.ReactElement;
  nextArrow?: React.ReactElement;
}

function SimpleSlider(props: SimpleSliderProps) {
  const settings = {
    dots: props.dots,
    infinite: props.infinite,
    speed: props.speed,
    slidesToShow: props.slidesToShow,
    slidesToScroll: props.slidesToScroll,
    autoplay: props.autoplay,
    autoplaySpeed: props.autoplaySpeed,
    pauseOnHover: props.pauseOnHover,
    fade: props.fade,
    arrows: props.arrows,
    prevArrow: props.prevArrow,
    nextArrow: props.nextArrow,
  };
  return (
    <div className="w-screen min-h-screen overflow-hidden"> {/* Full width and height, hide overflow */}
      <Slider {...settings}>
        {props.children}
      </Slider>
    </div>
  );
}

export default SimpleSlider;