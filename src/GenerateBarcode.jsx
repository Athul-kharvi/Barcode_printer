import React, { useState, useRef, useEffect } from 'react';
import bwipjs from 'bwip-js';
import './GenerateBarcode.css';

const GenerateBarcode = () => {
    const [barcodeValue, setBarcodeValue] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const canvasRef = useRef();

    useEffect(() => {
        if (barcodeValue.trim()) {
            generateBarcode();
        }
    }, [barcodeValue]);

    const generateBarcode = () => {
        try {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            bwipjs.toCanvas(canvas, {
                bcid: 'code128',
                text: barcodeValue,
                scale: 3,
                height: 10,
                includetext: true,
                textxalign: 'center',
            }, (err) => {
                if (err) {
                    console.error('Error generating barcode:', err);
                } else {
                    drawProductDetails();
                }
            });
        } catch (e) {
            console.error('Error generating barcode:', e);
        }
    };

    const drawProductDetails = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';

        ctx.fillText(productName, canvas.width / 2, canvas.height - 20);
        ctx.fillText(`Price: Rs ${productPrice}`, canvas.width / 2, canvas.height - 5);
    };

    const handlePrint = () => {
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL('image/png');
        const newWindow = window.open('', '_blank', 'width=600,height=400');
        
        newWindow.document.write(`
            <html>
                <head>
                    <title>Print Barcode</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            background-color: #f9f9f9; /* Light background for the entire page */
                        }
                        .barcode-container {
                            display: flex;
                            align-items: center;
                            gap: 20px; /* Space between the barcode image and product details */
                            // border: 2px solid black; /* Solid black border */
                            padding: 15px; /* Padding inside the container */
                            background-color: #949392; 
                            border-radius: 10px; /* Rounded corners */
                        }
                        .barcode-image {
                            max-width: 200px; /* Adjust the image size as needed */
                            max-height: 100px; /* Keep the image within reasonable bounds */
                        }
                        .product-details {
                            text-align: left;
                        }
                        .product-name {
                            font-size: 18px;
                            font-weight: bold;
                            margin: 0;
                        }
                        .product-price {
                            font-size: 16px;
                            color: #555;
                            margin: 5px 0 0 0;
                        }
                    </style>
                </head>
                <body onload="setTimeout(() => { window.print(); window.close(); }, 100);">
                    <div class="barcode-container">
                        <img src="${dataUrl}" alt="Barcode" class="barcode-image" />
                        <div class="product-details">
                            <h2 class="product-name">${productName}</h2>
                            <h3 class="product-price">Price: Rs ${productPrice}</h3>
                        </div>
                    </div>
                </body>
            </html>
        `);
        
        newWindow.document.close();
    };
    

    return (
        <div className="barcode-container">
            <h1>Barcode Generator</h1>
            <form className="barcode-form">
                <div className="form-group">
                    <label>
                        Barcode Value:
                        <input
                            type="text"
                            value={barcodeValue}
                            onChange={(e) => setBarcodeValue(e.target.value)}
                            required
                            placeholder="Enter barcode value"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Product Name:
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                            placeholder="Enter product name"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Product Price:
                        <input
                            type="number"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            required
                            placeholder="Enter product price"
                        />
                    </label>
                </div>
                <button type="button" onClick={handlePrint} className="print-button">
                    Print
                </button>
            </form>

            <canvas ref={canvasRef} width={300} height={100} style={{ border: '1px solid black' }} />
            <div className="barcode-info">
                <p>Product: {productName}</p>
                <p>Price: Rs {productPrice}</p>
            </div>
        </div>
    );
};

export default GenerateBarcode;
