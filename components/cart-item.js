import { LitElement, html, css } from 'lit';

class CartItem extends LitElement {
  static styles = css`
    :host {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .item-info {
      flex-grow: 1;
    }
    .item-name {
      font-weight: bold;
    }
    .item-price {
      color: #555;
    }
    .quantity-controls {
      display: flex;
      align-items: center;
    }
    .quantity-controls button {
      background-color: #eee;
      border: 1px solid #ccc;
      color: #333;
      cursor: pointer;
      padding: 2px 6px;
      margin: 0 5px;
      border-radius: 3px;
    }
    .remove-button {
      background-color: #ff4d4d;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 3px;
      cursor: pointer;
      margin-left: 10px;
    }
    .remove-button:hover {
      background-color: #cc0000;
    }
  `;

  static properties = {
    item: { type: Object }, // { productId, name, price, quantity }
  };

  constructor() {
    super();
    this.item = { productId: '', name: 'Unknown Item', price: 0, quantity: 1 };
  }

  _updateQuantity(change) {
    const newQuantity = this.item.quantity + change;
    if (newQuantity >= 0) { // Allow quantity to be 0, signaling removal intent
      this.dispatchEvent(new CustomEvent('update-quantity', {
        detail: { productId: this.item.productId, quantity: newQuantity },
        bubbles: true,
        composed: true
      }));
    }
  }

  _removeItem() {
    this.dispatchEvent(new CustomEvent('remove-item', {
      detail: { productId: this.item.productId },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    if (!this.item) return html``;
    return html`
      <div class="item-info">
        <span class="item-name">${this.item.name}</span>
        <span class="item-price"> - \$${(this.item.price * this.item.quantity).toFixed(2)}</span>
      </div>
      <div class="quantity-controls">
        <button @click="${() => this._updateQuantity(-1)}" ?disabled="${this.item.quantity <= 1}">-</button>
        <span>${this.item.quantity}</span>
        <button @click="${() => this._updateQuantity(1)}">+</button>
      </div>
      <button class="remove-button" @click="${this._removeItem}">Remove</button>
    `;
  }
}

customElements.define('cart-item', CartItem);
