const Avatar = require("./avatar");
const Balance = require("./balance");
const Favorite = require("./favorites");
const Product = require("./product");
const Record = require("./record");
const Review = require("./reviews");
const ShoppingCart = require("./shoppingcart");
const User = require("./user");
const Sale = require("./sales");
const Order = require("./order");
const Refill = require("./refill");

Product.hasMany(Favorite, {
    foreignKey: "productId",
});

Favorite.belongsTo(Product, {
    foreignKey: "productId",
});

User.hasOne(Avatar, {
    foreignKey: "userId",
});

Avatar.belongsTo(User, {
    foreignKey: "userId",
});

User.hasOne(Balance, {
    foreignKey: "userId",
});

Balance.belongsTo(User, {
    foreignKey: "userId",
});

ShoppingCart.belongsTo(Product, {
    foreignKey: "productId",
});

Product.hasMany(ShoppingCart, {
    foreignKey: "productId",
});

Product.hasMany(Review, {
    foreignKey: "productId",
});

Product.hasOne(Record, {
    foreignKey: "productId",
});

Record.belongsTo(Product, {
    foreignKey: "productId",
});

User.hasOne(Review, {
    foreignKey: "userId",
});

Review.belongsTo(User, {
    foreignKey: "userId",
});

Sale.belongsTo(Product, {
    foreignKey: "productId",
});

Product.hasOne(Sale, {
    foreignKey: "productId",
});

User.hasMany(Order, {
    foreignKey: "userId",
});

Order.belongsTo(User, {
    foreignKey: "userId",
});

Review.belongsTo(Product, {
    foreignKey: "productId",
});

Product.hasMany(Review, {
    foreignKey: "productId",
});

User.hasMany(Refill, {
    foreignKey: "userId",
});

Refill.belongsTo(User, {
    foreignKey: "userId",
});
