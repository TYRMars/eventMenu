/**
 * Created by Jonathan Zhang on 2017/4/24.
 */
;(function(){
    'use strict';
    var $form_add_task =$('.add-task')
        ,new_task={}
        ,task_list={};

    init();

    $form_add_task.on('submit',function (e){
      /*禁用默认行为*/
      e.preventDefault();
      /*获取Task的值*/
      new_task.content = $(this).find('input[name=content]').val();
      /*如果新Task的值为空 则直接返回 否则继续执行*/
      if(!new_task.content) return;
      /*存入新Task*/
      if(add_task(new_task)){
          render_task_list();
      }
    })
    function add_task(new_task) {
        /*将新Task推入Task——list*/
        task_list.push(new_task);
        /*更新localStorage*/
        store.set('task_list',task_list);
        return true;
    }

    function init() {
        task_list = store.get('task_list') || [];
    }

    function render_task_list() {
        console.log('1',1);
    }
})();
