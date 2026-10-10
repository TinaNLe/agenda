document.getElementById("view-toggle").addEventListener("change", function (e) {
    var view = e.target.checked ? "calendar" : "agenda";
    document.body.dataset.view = view;
    document.title = view.charAt(0).toUpperCase() + view.slice(1);
});
