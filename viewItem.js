window.onload = () => {
    setTimeout(() => {

        const BUSINESS_ID = "63469b101ea3eed7c4338cb4"; // sera dana business ID
        // const BUSINESS_ID = "6304aa113cb8eba9248eac8d"; //furnimart business ID
        const LoadDataFunction = async (url) => { try { let response = await fetch(url, { method: "get", headers: { "businessid": `${BUSINESS_ID}` } }); response = await response.json(); if (response.Error) { return console.log(response.Error) }; return response; } catch (e) { return }; };

        // item item page event
        let myEventfunction = () => {
            setTimeout(async () => {
                const ItemLocation = window.location.href;
                let checkItemPage = ItemLocation.includes("/item");

                if (checkItemPage) {
                    const itemName = window.location.href;
                    let url_pathname = itemName;
                    let urlInfo = url_pathname.split("/");

                    let itemNamePathID = urlInfo[4];
                    // console.log("itemNamePathID", itemNamePathID);

                    const getItemData = await LoadDataFunction(`https://api.soppiya.com/v2.1/widget/item/info/${itemNamePathID}`);
                    // console.log("getItemData", getItemData);


                    const basePrice = getItemData.basePrice;
                    // console.log("basePrice", basePrice);

                    let discount = 0;

                    if (getItemData.flashPrice) {
                        const FlashPrice = getItemData.flashPrice;
                        console.log("FlashPrice", FlashPrice);
                        discount = basePrice - FlashPrice;
                        console.log("discount", discount);
                    }

                    let MainPrice = basePrice - discount;
                    // console.log("MainPrice", MainPrice);

                    dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
                    dataLayer.push({
                        event: "view_item",
                        ecommerce: {
                            currency: "BDT",
                            value: `${MainPrice}`,
                            items: [
                                {
                                    item_id: `${getItemData._id}`,
                                    item_name: `${getItemData.name}`,
                                    discount: `${discount}`,
                                    price: `${getItemData.basePrice}`,
                                }
                            ]
                        }
                    });

                }

                // Check Out start google taq code
                const cartPage = window.location.href;
                const checkCartPage = cartPage.includes("/cart");
                if (checkCartPage) {
                    const _checkout_button_170q6_31 = document.querySelector("._checkout_button_170q6_31 ");
                    _checkout_button_170q6_31.addEventListener("click", async function () {

                        const cartData = await handleCartCompilation();
                        console.log("cart page Cart All Item", cartData);

                        dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
                        dataLayer.push({
                            event: "begin_checkout",
                            ecommerce: {
                                currency: "BDT",
                                value: `${cartData.summary.totalAmount}`,
                                items: [...cartData.details],
                                quantity: `${cartData.summary.totalCount}`
                            }
                        });
                    });

                }


            }, 1000);
        };


        // link change watcher
        let previousHistory = '';
        setInterval(() => {
            if (window.location.href !== previousHistory) {
                previousHistory = window.location.href;
                myEventfunction();
            }
        }, 100);


    }, 1000);





    function elementMaker(name, className, id) {
        try {
            let element = document.createElement(name);
            className && (element.className = className.join(" "));
            id && (element.id = id);
            return element;
        } catch (err) {
            console.log(err.message);
        };
    };

    function setAttributes(elementName, allAttributes) {
        for (let key in allAttributes) {
            elementName.setAttribute(key, allAttributes[key]);
        };
    };
}