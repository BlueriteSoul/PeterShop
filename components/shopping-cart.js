import { LitElement, html, css } from 'lit';
import './cart-item.js'; // Import cart-item component

class ShoppingCart extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      background-color: #f9f9f9;
    }
    h3 {
      margin-top: 0;
      margin-bottom: 16px;
      border-bottom: 1px solid #eee;
      padding-bottom: 8px;
    }
    .cart-items-list {
      margin-bottom: 16px;
    }
    .empty-cart-message {
      text-align: center;
      color: #777;
      padding: 20px;
    }
    .cart-total {
      font-weight: bold;
      font-size: 1.2em;
      text-align: right;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }
    .checkout-button {
      display: block;
      width: 100%;
      padding: 12px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1.1em;
      cursor: pointer;
      text-align: center;
      margin-top: 16px;
    }
    .checkout-button:hover {
      background-color: #218838;
    }
    .checkout-button:disabled {
      background-color: #aaa;
      cursor: not-allowed;
    }
  `;

  static properties = {
    items: { type: Array }, // Array of { productId, name, price, quantity }
  };

  constructor() {
    super();
    this.items = [];
  }

  _calculateTotal() {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  _handleCheckout() {
    if (this.items.length === 0) return;
    this.dispatchEvent(new CustomEvent('checkout', {
      detail: {
        items: this.items,
        total: this._calculateTotal()
      },
      bubbles: true,
      composed: true
    }));
    // Potentially clear cart after dispatching, or let parent handle it
    // this.items = [];
  }

  render() {
    const total = this._calculateTotal();
    return html`
      <h3>My Cart</h3>
      ${this.items.length === 0
        ? html`<p class="empty-cart-message">Your cart is empty.</p>`
        : html`
            <div class="cart-items-list">
              ${this.items.map(item => html`
                <cart-item .item="${item}"></cart-item>
              `)}
            </div>
            <div class="cart-total">
              Total: \$${total.toFixed(2)}
            </div>
            <button class="checkout-button" @click="${this._handleCheckout}" ?disabled="${this.items.length === 0}">
              Proceed to Checkout
            </button>
          `}
    `;
  }
}

customElements.define('shopping-cart', ShoppingCart);
