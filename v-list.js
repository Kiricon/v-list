
/**
 * This is the class that controls each instance of your custom element.
 */
class VList extends HTMLElement {
    /**
     * Part of the custom element spec. Returns an array of strings that are 
     * the names of attributes that this element observes/listens to.
     * 
     * @returns {Array} an array of strings, each of which representing an 
     *  attribute.
     */
    static get observedAttributes() {
        return [];
    };

    constructor() {
        super();

        this.style.overflowY = "scroll";
        this.style.display = "block";

        // add any initial variables here
        this.rowData = [];
        this.generator = null;
        this.innerHTML = '<div class="container"><div class="subContainer"></div></div>';
        this.container = document.querySelector('.container');
        this.subContainer = this.container.querySelector('.subContainer');
        
    }

    /**
     * Part of the custom element spec. Called after your element is attached to
     * the DOM. Do anything related to the element or its children here in most
     * cases.
     */
    connectedCallback() {
        this.addEventListener('scroll', this.adjustScrollView);
    }

    /**
     * Part of the custom element spec. Called after your element is remove from
     * the DOM. Disconnect any listeners or anything else here.
     */
    disconnectedCallback() {

    }

    /**
     * Part of the custom element spec. Called when one of the observed
     * attributes changes, either via setAttribute() or with the attribute being
     * manually set in the HTML.
     * 
     * @param {String} name the name of the attribute that changed
     * @param {Mixed} oldValue the previous value of the attribute
     * @param {Mixed} newValue the new value of the attribute
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // respond to a changed attribute here
    }

    render(rowData, rowHeight, generator) {
        this.rowData = rowData;
        this.generator = generator;
        this.rowHeight = rowHeight;
        this.offset = 10;
        this.viewAbleRows = Math.round((this.scrollTop + this.offsetHeight) / this.rowHeight);
        this.offsetThreshold = this.viewAbleRows
        this.container.style.height = `${rowData.length * rowHeight}px`;
        this.adjustScrollView();
        
        this.renderAll();
    }

    renderAll() {
        this.subContainer.innerHTML = "";
        this.subContainer.style.paddingTop = `${this.scrollTop}px`;
        for(let i = this.viewAbleRowStart; i < this.viewAbleRowEnd + this.offset; i++) {
            this.subContainer.appendChild(this.generator(this.rowData[i]));
        }
    }

    adjustScrollView() {
        this.viewAbleRowStart = Math.round(this.scrollTop / this.rowHeight);
        this.viewAbleRowEnd = Math.round((this.scrollTop + this.offsetHeight) / this.rowHeight);

        if(this.offsetThreshold !== 0 && (this.offsetThreshold - this.viewAbleRows - this.offset) === this.viewAbleRowStart) {
            this.offsetThreshold -= this.viewAbleRows;
            this.renderAll();
        }else if((this.offsetThreshold + this.offset) === this.viewAbleRowEnd) {
            this.offsetThreshold += this.viewAbleRows;
            this.renderAll();
        }
        

        console.log(`${this.viewAbleRowStart} - ${this.viewAbleRowEnd}`);
    }
}

customElements.define("v-list", VList);
