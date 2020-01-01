function decryptEmail(encoded) {
    var address = atob(encoded);
    window.location.href = "mailto:" + address;
}