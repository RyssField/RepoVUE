import { defineStore } from "pinia";

export const useShoppingStore = defineStore('shopping', {
    state: () => {
        if (localStorage.getItem("shopping")) {
            return {
                cartItems: JSON.parse(localStorage.getItem("shopping"))
            }
        }
        return {
            cartItems: []
        }
    },

    getters: {
        countCartItems() {
            return this.cartItems.length;
        },

        getCartItems() {
            return this.cartItems;
        }
    },

    actions: {
        addToCart(item) {
            let index = this.cartItems.findIndex(product => product._id === item._id);
            if (index !== -1) {
                this.cartItems[index].quantity++;
            } else {
                item.quantity = 1;
                this.cartItems.push(item);
            }
            localStorage.setItem('shopping', JSON.stringify(this.cartItems));
        },
        
        incrementQuantity(item) {
            let index = this.cartItems.findIndex(product => product._id === item._id);
            if (index !== -1) {
                this.cartItems[index].quantity++;
            }
            localStorage.setItem('shopping', JSON.stringify(this.cartItems));
        },

        decrementQuantity(item) {
            let index = this.cartItems.findIndex(product => product._id === item._id);
            if (index !== -1) {
                this.cartItems[index].quantity--;
                if (this.cartItems[index].quantity <= 0) {
                    this.cartItems = this.cartItems.filter(product => product._id !== item._id);
                }
            }
            localStorage.setItem('shopping', JSON.stringify(this.cartItems));
        },

        removeFromCart(item) {
            this.cartItems = this.cartItems.filter(product => product._id !== item._id);
            localStorage.setItem('shopping', JSON.stringify(this.cartItems));
        },

        removeCart() {
            this.cartItems = [];
            localStorage.removeItem('shopping');
        }
    }
})