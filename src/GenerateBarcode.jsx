import React, { useState, useRef, useEffect } from 'react';
import bwipjs from 'bwip-js';
import './GenerateBarcode.css';

const GenerateBarcode = () => {
    const [barcodeValue, setBarcodeValue] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [format, setFormat] = useState('Normal');
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

        const htmlContent = `
            <html>
                <head>
                    <title>Print Barcode - ${format}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0; /* Remove default margins */
                            display: flex;
                            justify-content: center; /* Center horizontally */
                            align-items: center; /* Center vertically */
                            height: 100vh; /* Full viewport height to enable vertical centering */
                            background-color: #f9f9f9; /* Optional background color */
                        }

                        .barcode-container {
                            display: flex;
                            flex-direction: ${format === 'Rattail' ? 'row' : 'column'};
                            align-items: ${format ==='Normal' ? 'center':''};
                            padding: 5px;
                            width:    ${format ==='Rattail' ? '30rem':'25rem'};
                            border: 1px solid black;
                            padding: 10px;
                            background-color: #eee;
                            border-radius: 8px;
                        }
                        .barcode-image {
                            width: 200px;
                            height: 100px;
                            margin: ${format === 'Rattail' ? '0 10px 0 0' : '0 0 10px 0'};
                        }
                        .product-details {
                            margin-left: ${format === 'Rattail' ? '50px' : ''};
                            margin-top: ${format === 'Rattail' ? '20px' : ''};
                            text-align: center;
                        }
                        .product-name {
                            font-size: 18px;
                            font-weight: bold;
                            margin: 0;
                        }
                        .product-price {
                            font-size: 16px;
                            color: #555;
                            margin: 5px 0 0;
                        }
                    </style>
                </head>
                <body onload="window.print(); window.close();">
                    <div class="barcode-container">
                        <img src="${dataUrl}" alt="Barcode" class="barcode-image" />
                        <div class="product-details">
                            <h2 class="product-name">${productName}</h2>
                            <h3 class="product-price">Price: Rs ${productPrice}</h3>
                        </div>
                    </div>
                </body>
            </html>
        `;

        newWindow.document.write(htmlContent);
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
                <div className="form-group">
                    <label>
                        Format:
                        <select
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                            className="cool-dropdown"
                        >
                            <option value="Normal">Normal</option>
                            <option value="Rattail">Rattail</option>
                        </select>
                    </label>
                </div>
                <button type="button" onClick={handlePrint} className="print-button">
                    Print
                </button>
            </form>

            <canvas ref={canvasRef} width={300} height={100} style={{ border: '1px solid black' }} />
        </div>
    );
};

export default GenerateBarcode;
