import React from "react";
import './FaceRecognition.css';

const FaceRecognition = ({ boxes, imageURL }) => {
    return (
        <div className="center ma"> 
            <div className="absolute mt2">
                <img id='inputImage' src={imageURL} alt='' width={'500px'} height={'auto'}/>
                {boxes.map(box => {
                        return <div key={box.top} className="bounding-box" style={{top: box.top, right: box.right, bottom: box.bottom, left: box.left}}></div>
                    })
                }
            </div>
        </div>
    );
}
export default FaceRecognition;