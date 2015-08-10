$(function() {
    ListManager = new Marionette.Application();
    
    /** MODELS & COLLECTIONS **/
    
    ListManager.List =  Backbone.NestedModel.extend({
        url: '/api/lists/',
    });
    
    ListManager.ListItem =  Backbone.NestedModel.extend({
        url: '/api/listitems/',
    });
    
    ListManager.ListCollection = Backbone.Collection.extend({
        model: ListManager.List,
        url: '/api/lists/'
    });
    
    ListManager.ListItemCollection = Backbone.Collection.extend({
        model: ListManager.ListItem,
        url: '/api/listitems/'
    });
    
    /** VIEWS **/
    
    ListManager.ListItemView = Marionette.ItemView.extend({
        template: '#list-item-template',
        tagName: 'li',
        className: 'list-group-item',
        onRender: function() {
            this.stickit();
        },
        bindings: {
            '.description': 'description',
        },
        initialize: function() {
            this.listenTo(this.model, "change", this.render);
        },
    });
    
    ListManager.ListItemsView = Marionette.CompositeView.extend({
        template: '#list-items-template',
        childView: ListManager.ListItemView,
        childViewContainer: 'ul',
    });
    
    ListManager.ListView = Marionette.ItemView.extend({
        template: '#list-template',
        onRender: function() {
            this.$('div.panel').append(this.listItemsView.render().$el.html());
            this.stickit();
        },
        bindings: {
            '.name': 'name',
        },
        initialize: function() {
            this.listItems = new ListManager.ListItemCollection();
            this.listItems.set(this.model.get('items'));
            this.listItemsView = new ListManager.ListItemsView({
                collection: this.listItems,
            });
            this.listenTo(this.model, "change", this.render);
        },
    });
    
    ListManager.AllListsView = Marionette.CompositeView.extend({
        template: '#all-lists-template',
        childView: ListManager.ListView,
        childViewContainer: 'div',
    });
    
    /** START **/
    
    ListManager.on('before:start', function() {
        var RegionContainer = Marionette.LayoutView.extend({
            el: '#app-container',
            regions: {
                allLists: '#all-lists-container',
            }
        });
        ListManager.regions = new RegionContainer();
    });
    
    ListManager.on('start', function() {
        ListManager.AllLists = new ListManager.ListCollection();
        ListManager.AllLists.fetch();
        
        var allListsView = new ListManager.AllListsView({
            collection: ListManager.AllLists,
        });
        
        ListManager.regions.allLists.show(allListsView);
    });

    ListManager.start();
});
