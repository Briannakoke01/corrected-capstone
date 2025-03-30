import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Home.css";
import { Stage, Layer, Image, Text } from "react-konva";
import MemeGallery from "../components/MemesGallery";
import Header from "../components/Header";
import Footer from "../components/Footer";
const loader = "/loader5.gif";
const API_BASE_URL=process.env.REACT_APP_API_BASE_URL 
const MemeGenerator = () => {
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [memeImage, setMemeImage] = useState("data:,");
  const [, setApiLink] = useState("");
  const [memedata, setMemeData] = useState([]);
  const meme = "1st-World-Canadian-Problems";
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0);
  const [image, setImage] = useState(null);
  const [displayTopText, setDisplayTopText] = useState("Top Text");
  const [displayBottomText, setDisplayBottomText] = useState("Bottom Text");
  const [showLoader, setShowLoader] = useState(false);
  const fileInputRef = useRef(null);
  const stageRef = useRef(null);

  const MAX_WIDTH = 700; // Maximum width for the image
  const MAX_HEIGHT = 530; // Maximum height for the image

  const getLink = () => {
    const params = new URLSearchParams({
      meme: meme,
      top: topText,
      bottom: bottomText,
    });
    return `/meme?${params.toString()}`;
  };

  const update = () => {
    const link = getLink();
    setMemeImage(link);
    setApiLink(window.origin + link);
  };

  useEffect(() => {
    update();
  }, [topText, bottomText]);

  // Fetch paginated memes
  const getMemesData = async (page = 1) => {
    try {
      setShowLoader(true);
      const response = await axios.get(
        `${API_BASE_URL}/get-memes?page=${page}&limit=50`
      );
      setMemeData(response.data.memes);
      setTotalPages(response.data.totalPages);
      setShowLoader(false);
    } catch (error) {
      setShowLoader(false);
      console.error("Error fetching memes:", error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    getMemesData(currentPage);
  }, [currentPage]);

  // Handle page click
  // const handlePageClick = (event) => {
  //   setCurrentPage(event.selected + 1);
  // };
  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage); // Update page number
    getMemesData(selectedPage); // Fetch memes for the new page
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.src = reader.result;
        img.onload = () => setImage(img);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddText = () => {
    setDisplayTopText(topText);
    setDisplayBottomText(bottomText);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setTopText("");
    setBottomText("");
    setDisplayTopText("");
    setDisplayBottomText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL({
        mimeType: "image/png",
        quality: 1,
      });

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "meme.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("Stage reference is not set.");
    }
  };

  const handleMemeClick = (memeUrl) => {
    const proxyUrl = `${
      process.env.REACT_APP_API_BASE_URL
    }/proxy-image?memeUrl=${encodeURIComponent(memeUrl)}`;
    const img = new window.Image();
    img.crossOrigin = "Anonymous"; // Set CORS as Anonymous
    img.src = proxyUrl; // Request the image from your proxy server

    img.onload = () => setImage(img); // Set the clicked image as the main editor image
  };

  const getFontSizeForText = (text, maxWidth) => {
    const context = document.createElement('canvas').getContext('2d');
    let fontSize = 72; // Initial font size
    context.font = `${fontSize}px Arial Black`;

    // Reduce font size until the text fits the maxWidth
    while (context.measureText(text).width > maxWidth && fontSize > 10) {
      fontSize -= 2;
      context.font = `${fontSize}px Arial Black`;
    }
    return fontSize;
  };
  const getStrokeWidthForText = (text, maxWidth) => {
    const baseStrokeWidth = 1.8; // Base stroke width when text is short
    const textLength = text.length;
    const maxTextLength = 30; // Arbitrary max text length for reducing stroke width
    // Calculate a proportional stroke width based on text length
    const adjustedStrokeWidth = Math.max(baseStrokeWidth - textLength / maxTextLength, 0.5);
    return adjustedStrokeWidth;
  };

  return (
    <>
     {error && <p style={{ color: "red" }}>{error}</p>}
     <Header/>
     {
      showLoader?
      <div style={{display:'flex', justifyContent:"center", alignItems:"center", height:"100vh"}}>
        <img src={loader} alt="loader"/>
      </div>
      :
      <div className="container">
      <div className="meme-generator-container">
        <h1>Meme Generator</h1>
        <div className="meme-layout">
          {/* Left Section: Input Fields */}
          <div className="input-section">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="file-input"
            />

            <input
              type="text"
              placeholder="Top Text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              className="text-input"
              id="top-text"
              data-cy="top-text-input"
            />
            <input
              type="text"
              placeholder="Bottom Text"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              className="text-input"
              id="bottom-text"
              data-cy="bottom-text-input"
            />
            <div className="button-container">
              <button className="generate-button" onClick={handleAddText} data-cy="generate-button">
                Generate
              </button>
              <button className="download-button" data-cy="download-button" onClick={handleDownload}>
                Download
              </button>
            </div>
          </div>

          {/* Right Section: Image Preview */}
          {image && (
            <div className="image-preview-container">
              {(() => {
                const widthScale = MAX_WIDTH / image.width;
                const heightScale = MAX_HEIGHT / image.height;
                const scale = Math.min(widthScale, heightScale, 1);

                return (
                  <Stage
                    width={image.width * scale}
                    height={image.height * scale}
                    ref={stageRef}
                  >
                    <Layer>
                      <Image
                        image={image}
                        width={image.width * scale}
                        height={image.height * scale}
                        listening={false}
                      />
                      {displayTopText && (
                        <Text
                          text={displayTopText}
                          x={(image.width * scale) / 2}
                          y={16}
                          fontSize={getFontSizeForText(displayTopText, image.width * scale - 20)} 
                          fill="white"
                          stroke="black"
                          strokeWidth={getStrokeWidthForText(displayTopText, image.width * scale - 20)}
                          shadowColor="black"
                          shadowBlur={4}
                          shadowOffsetX={2}
                          shadowOffsetY={2}
                          shadowOpacity={0.6}
                          fontStyle="bold"
                          align="center"
                          width={image.width * scale}
                          offsetX={(image.width * scale) / 2}
                          fontFamily="Arial Black"
                        />
                      )}
                      {displayBottomText && (
                        <Text
                          text={displayBottomText}
                          x={(image.width * scale) / 2}
                          y={image.height * scale - 55 - 20}
                          fontSize={getFontSizeForText(displayBottomText, image.width * scale - 20)} 
                          fill="white"
                          stroke="black"
                          strokeWidth={getStrokeWidthForText(displayBottomText, image.width * scale - 20)}
                          shadowColor="black"
                          shadowBlur={4}
                          shadowOffsetX={2}
                          shadowOffsetY={2}
                          shadowOpacity={0.6}
                          fontStyle="bold"
                          align="center"
                          width={image.width * scale}
                          offsetX={(image.width * scale) / 2}
                          fontFamily="Arial Black"
                          wrap="word"
                        />
                      )}
                    </Layer>
                  </Stage>
                );
              })()}
              {/* <button
                className="remove-image-button"
                onClick={handleRemoveImage}
              >
                ×
              </button> */}
            </div>
          )}
        </div>
      </div>

      <MemeGallery
        memeImage={memeImage}
        memedata={memedata}
        handleMemeClick={handleMemeClick}
        handlePageClick={handlePageClick}
        totalPages={totalPages}
         currentPage={currentPage}
      />
    </div>
     }

     <Footer/>
    </>
  );
};

export default MemeGenerator;
