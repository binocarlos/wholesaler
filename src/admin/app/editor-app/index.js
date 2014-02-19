module.exports = function(options){
  options = options || {};

  ['title', 'blueprints', 'id', 'controller', 'warehouse'].forEach(function(f){
    if(!options[f]){
      throw new Error('option: ' + f + ' required by editor-app');
    }
  })

  angular
    .module(options.id, [
      require('digger-editor'),
      require('file-uploader')
    ])

    .controller(options.controller, function($scope){

      var blueprints = options.blueprints || [];

      if(typeof(blueprints)==='string'){
        blueprints = [blueprints];
      }
      $digger.blueprint.load(blueprints);  
      
      $scope.container = $digger.connect(options.warehouse);
      $scope.container.attr('name', options.title);

      $scope.settings = options;

      $scope.$on('growl', function($ev, message, type){

        type = type || 'info';
        $.bootstrapGrowl(message, {
          ele: 'body', // which element to append to
          type: type, // (null, 'info', 'error', 'success')
          offset: {from: 'top', amount: 20}, // 'top', or 'bottom'
          align: 'right', // ('left', 'right', or 'center')
          width: 250, // (integer, or 'auto')
          delay: 4000,
          allow_dismiss: true,
          stackup_spacing: 10 // spacing between consecutively stacked growls.
        });
      })
      
    })

}
