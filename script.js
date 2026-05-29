const canvas =
document.getElementById("board");

const ctx =
canvas.getContext("2d");

const colorPicker =
document.getElementById("colorPicker");

const brushSize =
document.getElementById("brushSize");

let drawing = false;

let tool = "pencil";

let startX, startY;

let undoStack = [];

let redoStack = [];

resizeCanvas();

function resizeCanvas(){

    canvas.width = window.innerWidth;

    canvas.height =
    window.innerHeight - 70;
}

window.addEventListener(
    "resize",
    resizeCanvas
);

function saveState(){

    undoStack.push(
        canvas.toDataURL()
    );

    redoStack = [];
}

function restoreState(stack, oppositeStack){

    if(stack.length){

        oppositeStack.push(
            canvas.toDataURL()
        );

        const img = new Image();

        img.src = stack.pop();

        img.onload = () => {

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            ctx.drawImage(
                img,
                0,
                0
            );
        };
    }
}

canvas.addEventListener(
    "mousedown",
    e => {

        saveState();

        drawing = true;

        startX = e.offsetX;

        startY = e.offsetY;

        if(tool === "text"){

            const text =
            prompt("Enter text");

            if(text){

                ctx.fillStyle =
                colorPicker.value;

                ctx.font =
                `${brushSize.value * 5}px Arial`;

                ctx.fillText(
                    text,
                    startX,
                    startY
                );
            }

            drawing = false;
        }
    }
);

canvas.addEventListener(
    "mouseup",
    e => {

        if(!drawing) return;

        drawing = false;

        ctx.beginPath();

        const endX = e.offsetX;

        const endY = e.offsetY;

        ctx.strokeStyle =
        colorPicker.value;

        ctx.lineWidth =
        brushSize.value;

        if(tool === "rect"){

            ctx.strokeRect(
                startX,
                startY,
                endX - startX,
                endY - startY
            );
        }

        if(tool === "circle"){

            const radius =
            Math.sqrt(
                Math.pow(endX - startX, 2) +
                Math.pow(endY - startY, 2)
            );

            ctx.beginPath();

            ctx.arc(
                startX,
                startY,
                radius,
                0,
                Math.PI * 2
            );

            ctx.stroke();
        }

        if(tool === "line"){

            ctx.beginPath();

            ctx.moveTo(
                startX,
                startY
            );

            ctx.lineTo(
                endX,
                endY
            );

            ctx.stroke();
        }
    }
);

canvas.addEventListener(
    "mousemove",
    draw
);

function draw(e){

    if(!drawing) return;

    if(tool !== "pencil" &&
       tool !== "eraser") return;

    ctx.lineWidth =
    brushSize.value;

    ctx.lineCap = "round";

    ctx.strokeStyle =
    tool === "eraser"
    ? "white"
    : colorPicker.value;

    ctx.lineTo(
        e.offsetX,
        e.offsetY
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        e.offsetX,
        e.offsetY
    );
}

document.getElementById("pencil")
.onclick = () => tool = "pencil";

document.getElementById("eraser")
.onclick = () => tool = "eraser";

document.getElementById("rect")
.onclick = () => tool = "rect";

document.getElementById("circle")
.onclick = () => tool = "circle";

document.getElementById("line")
.onclick = () => tool = "line";

document.getElementById("text")
.onclick = () => tool = "text";

document.getElementById("undo")
.onclick = () =>
restoreState(
    undoStack,
    redoStack
);

document.getElementById("redo")
.onclick = () =>
restoreState(
    redoStack,
    undoStack
);

document.getElementById("clear")
.onclick = () => {

    saveState();

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
};

document.getElementById("download")
.onclick = () => {

    const link =
    document.createElement("a");

    link.download =
    "whiteboard.png";

    link.href =
    canvas.toDataURL();

    link.click();
};

document.getElementById("imageUpload")
.addEventListener(
    "change",
    e => {

        const file =
        e.target.files[0];

        const reader =
        new FileReader();

        reader.onload =
        event => {

            const img =
            new Image();

            img.src =
            event.target.result;

            img.onload = () => {

                ctx.drawImage(
                    img,
                    50,
                    50,
                    300,
                    300
                );
            };
        };

        reader.readAsDataURL(file);
    }
);

document.addEventListener(
    "keydown",
    e => {

        if(e.ctrlKey &&
           e.key === "z"){

            restoreState(
                undoStack,
                redoStack
            );
        }

        if(e.ctrlKey &&
           e.key === "y"){

            restoreState(
                redoStack,
                undoStack
            );
        }
    }
);