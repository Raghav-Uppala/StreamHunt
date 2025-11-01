class ProgressBar extends HTMLElement {
  #shadow;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render()
  }

  render() {
    let el = document.createElement("div")
    el.className = "chart"
    el.id = "graph"
    
    let options = {
        percent:  this.getAttribute('data-percent') || 25,
        size: this.getAttribute('data-size') || 220,
        lineWidth: this.getAttribute('data-line') || 15,
        rotate: this.getAttribute('data-rotate') || 0
    }

    let fontSize = options.size/4
    
    let canvas = document.createElement('canvas');
    let span = document.createElement('span');
    span.textContent = Math.round(options.percent);
        
    if (typeof(G_vmlCanvasManager) !== 'undefined') {
        G_vmlCanvasManager.initElement(canvas);
    }
    
    let ctx = canvas.getContext('2d');
    canvas.width = canvas.height = options.size;
    
    el.appendChild(span);
    el.appendChild(canvas);
    
    ctx.translate(options.size / 2, options.size / 2); // change center
    ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg
    
    //imd = ctx.getImageData(0, 0, 240, 240);
    let radius = (options.size - options.lineWidth) / 2;
    
    let drawCircle = function(color, lineWidth, percent) {
    		percent = Math.min(Math.max(0, percent), 1);
    		ctx.beginPath();
    		ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
    		ctx.strokeStyle = color;
            ctx.lineCap = 'round'; // butt, round or square
    		ctx.lineWidth = lineWidth
    		ctx.stroke();
    };
    let bgcolor = getComputedStyle(document.documentElement).getPropertyValue("--primary-100").trim();
    let maincolor = getComputedStyle(document.documentElement).getPropertyValue("--secondary-200").trim();

    drawCircle(bgcolor, options.lineWidth, 100 / 100);
    drawCircle(maincolor, options.lineWidth, options.percent / 100);

    this.#shadow.innerHTML = `
    <style>
      div {
        position:relative;
        background-color:black;
        padding:10px;
        border-radius:${options.size}px;
        width:${options.size}px;
        height:${options.size}px;
      }
      canvas {
        display: block;
        position:absolute;
        top:10px;
        left:10px;
      }
      span {
        color:var(--text-900);
        display:block;
        line-height:${options.size}px;
        text-align:center;
        width:${options.size}px;
        font-family:sans-serif;
        font-size:${fontSize}px;
        font-weight:100;
      }
    </style>
    `;
    this.#shadow.appendChild(el)
  }
}
customElements.define("progress-bar", ProgressBar);
