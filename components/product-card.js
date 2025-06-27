import { LitElement, html, css } from 'lit';

class ProductCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 16px;
      margin: 16px;
      max-width: 300px;
      box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
    }
    img {
      max-width: 100%;
      height: auto;
      border-bottom: 1px solid #eee;
      margin-bottom: 12px;
    }
    h3 {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 1.5em;
    }
    .price {
      font-size: 1.2em;
      color: #333;
      margin-bottom: 12px;
    }
    button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 15px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 1em;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    button:hover {
      background-color: #0056b3;
    }
    button:disabled {
      background-color: #aaa;
      cursor: not-allowed;
    }
  `;

  static properties = {
    productId: { type: String },
    name: { type: String },
    price: { type: Number },
    imageUrl: { type: String },
    description: { type: String },
  };

  constructor() {
    super();
    this.productId = '';
    this.name = 'Product Name';
    this.price = 0.00;
    this.imageUrl = ''; // Placeholder image if none provided
    this.description = 'Product description goes here.';
  }

  _addToCart() {
    this.dispatchEvent(new CustomEvent('add-to-cart', {
      detail: {
        productId: this.productId,
        name: this.name,
        price: this.price,
        quantity: 1 // Default quantity to add
      },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      ${this.imageUrl ? html`<img src="${this.imageUrl}" alt="${this.name}">` : ''}
      <h3>${this.name}</h3>
      <p>${this.description}</p>
      <div class="price">\${this.price.toFixed(2)}</div>
      <button @click="${this._addToCart}">Add to Cart</button>
    `;
  }
}

customElements.define('product-card', ProductCard);
