/** BACKBONE UTILITIES **/

var _sync = Backbone.sync;
Backbone.sync = function(method, model, options){
    options.beforeSend = function(xhr){
        xhr.setRequestHeader('X-CSRFToken', $.cookie('csrftoken'));
    };
    return _sync(method, model, options);
};

var _url = Backbone.NestedModel.prototype.url;

Backbone.NestedModel.prototype.url = function() {
    var origUrl = _url.call(this);
    return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
}

$(function() {
        
    ListManager = new Marionette.Application();
    
    /** MODELS & COLLECTIONS **/
    
    ListManager.List =  Backbone.NestedModel.extend({
        urlRoot: '/api/lists/',
    });
    
    ListManager.ListItem =  Backbone.NestedModel.extend({
        url: '/api/listitems/',
    });
    
    ListManager.ListCollection = Backbone.Collection.extend({
        model: ListManager.List,
        url: '/api/lists/'
    });
    
    /** VIEWS **/
    
    ListManager.ListView = Marionette.ItemView.extend({
        template: '#list-template',
        onRender: function() {
            this.stickit();
        },
        bindings: {
            '.name': 'name',
        },
        initialize: function() {
            this.listenTo(this.model, "change", this.render);
        },
        events: {
            'click .add-button': 'createNewItem',
        },
        createNewItem: function() {
            var listItem = new ListManager.ListItem({
                description: this.$('.new-description').val(),
                list: this.model.get('id')
            });
            listItem.save();
            this.model.fetch();
        }
    });
    
    ListManager.AllListsView = Marionette.CompositeView.extend({
        template: '#all-lists-template',
        childView: ListManager.ListView,
        childViewContainer: 'div',
    });
    
    /** START **/
    
    ListManager.on('before:start', function() {
        var RegionContainer = Marionette.LayoutView.extend({
            el: '#app-region',
            regions: {
                allLists: '#all-lists-region',
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
