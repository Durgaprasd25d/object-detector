// export const renderAllPredications = (predictions, ctx) => {
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//     // Fonts
//     const font = "16px sans-serif";
//     ctx.font = font;
//     ctx.textBaseline = "top";

//     predictions.forEach((pred) => {
//         const [x, y, width, height] = pred['bbox'];
//         const isPerson = pred.class === "person";

//         // Bounding box 
//         ctx.strokeStyle = isPerson ? "#ff0000" : "#00FFFF";
//         ctx.lineWidth = 4;
//         ctx.strokeRect(x, y, width, height);

//         // Fill color
//         ctx.fillStyle = `rgba(255, 0, 0, ${isPerson ? 0.2 : 0})`;
//         ctx.fillRect(x, y, width, height);

//         // Draw the label background
//         ctx.fillStyle = isPerson ? "#ff0000" : "#00FFFF";
//         const textWidth = ctx.measureText(pred.class).width;
//         const textHeight = parseInt(font, 10);
//         ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

//         ctx.fillStyle = "#000000";
//         ctx.fillText(pred.class, x, y);
//     });
// };
