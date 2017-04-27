/**
 * Created by Jonathan Zhang on 2017/4/24.
 */
;(function(){
    'use strict';

    var $form_add_task =$('.add-task')
        ,$task_delete
        ,$task_detail
        ,$task_detail_trigger
        ,$task_detail = $('.task-detail')
        ,$task_detail_mask = $('.task-detail-mask')
        ,task_list={}
        ;

    init();

    $form_add_task.on('submit', on_add_task_form_submit);
    $task_detail_mask.on('click',hide_task_detail);

    function  on_add_task_form_submit(e) {
        var new_task ={},$input;
        /*禁用默认行为*/
        e.preventDefault();
        /*获取Task的值*/
        $input =  $(this).find('input[name=content]');
        new_task.content = $input.val();
        /*如果新Task的值为空 则直接返回 否则继续执行*/
        if(!new_task.content) return;
        /*存入新Task*/
        if(add_task(new_task)) {
            render_task_list();
            $input.val(null);
        }
    }

    function listen_task_detail() {
        $task_detail_trigger.on('click',function () {
            var $this = $(this);
            var $item = $this.parent();
            var index = $item.data('index');
            console.log('index',index);
            show_task_detail('index');

        })
    }

    /*监听 delete_task*/
    function listen_delete_task() {
        $task_delete.on('click',function () {
            var $this = $(this);
            var $item = $this.parent();
            var index = $item.data('index');
            var tmp = confirm('确定删除！');
            return tmp ? delete_task(index) : null;
        })
    }

    function show_task_detail() {
        $task_detail.show();
        $task_detail_mask.show();
    }
    function hide_task_detail() {
        $task_detail.hide();
        $task_detail_mask.hide();
    }


    function add_task(new_task) {
        /*将新Task推入Task__list*/
        task_list.push(new_task);
        /*更新localStorage*/
        refresh_task_list();
        return true;
    }

    /*
    * 刷新local storage数据并渲染模板*/
    function refresh_task_list() {
        /*更新localStorage*/
        store.set('task_list',task_list);
        render_task_list();

    }

    function delete_task(index) {
        /*如果没有index 或者index不存在则直接返回*/
        if(index === undefined || !task_list[index]) return;
        /*删除task*/
        delete task_list[index];
        console.log('task_list',task_list);
        /*更新localStorage*/
        refresh_task_list();
    }

    function init() {
        task_list = store.get('task_list') || [];
        if(task_list.length){
            render_task_list();
        }
    }

    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');
        for(var i=0;i<task_list.length;i++){
            var $task = render_task_item(task_list[i],i);
            $task_list.append($task);
        }

        /*实时更新锚点*/
        $task_delete = $('.action.delete');
        $task_detail_trigger = $('.action.detail');
        listen_delete_task();
        listen_task_detail();
    }

    function render_task_item(data,index) {
        if(!data || !index) return;
        var list_item_item =
            '<div class="task-item" data-index="' +index+ '">' +
            '<span><input type="checkbox"/></span>' +
            '<span class="task-content">'+ data.content +'</span>' +
            '<span class="action delete"> 删除 </span>' +
            '<span class="action detail"> 详细 </span>' +
            '</div>';
        return $(list_item_item);
    }
})();
