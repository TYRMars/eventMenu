/**
 * Created by Jonathan Zhang on 2017/4/24.
 */
;(function(){
    'use strict';

    var $form_add_task = $('.add-task')
        ,$task_delete
        ,$task_detail
        ,$task_detail_trigger
        ,$task_detail = $('.task-detail')
        ,$task_detail_mask = $('.task-detail-mask')
        ,task_list=[]
        ,current_index
        ,$update_form
        ,$task_detail_content
        ,$task_detail_content_input
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

    /*监听打开task详情事件 task_detail*/
    function listen_task_detail() {
        var index;
        $('.task-item').on('dblclick',function () {
            index = $(this).data('index');
            show_task_detail(index);
        })
        $task_detail_trigger.on('click',function () {
            var $this = $(this);
            var $item = $this.parent();
            index = $item.data('index');
            show_task_detail(index);
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

    /*查看task详情*/
    function show_task_detail(index) {
        /*生成详情模块*/
        render_task_detail(index);
        current_index = index;
        /*显示详情模版（默认隐藏）*/
        $task_detail.show();
        /*显示详情模版mask（默认隐藏）*/
        $task_detail_mask.show();
    }

    /*更新task*/
    function update_task(index,data) {
        if(!index || !task_list[index])return;
        task_list[index]= $.extend({},task_list[index],data);
        refresh_task_list();
    }

    /*隐藏task详情*/
    function hide_task_detail() {
        $task_detail.hide();
        $task_detail_mask.hide();
    }

    /*渲染指定Task的详细信息*/
    function render_task_detail(index) {
        if(index === undefined || !task_list[index]) return;

        var item = task_list[index];

        var tpl='<form>'+
            '<div class="content">'+
            item.content  +
            '</div>' +
            '<div class="input-item"><!--任务描述开始-->' +
            '<input style="display: none" type="text" name="content" value="'+(item.content || '')+'">'+
            '</div>'+
            '<div class="desc input-item">' +
            '<textarea name="desc" >'+ (item.desc || '')  +'</textarea>' +
            '</div>' +
            '</div><!--任务描述结束-->' +
            '<div class="remind input-item"><!--任务定时提醒开始-->' +
            '<input name="remind_date" type="date" value="'+item.remind_date+'">' +
            '</div>'+
            '<div class="input-item"><button type="submit">更新</button></div><!--任务定时提醒结束-->'+
            '</form>';

        /*清空task详情模版*/
        $task_detail.html(null);
        /*用新模版替换旧模版*/
        $task_detail.html(tpl);
        /*选中其中的form元素，因为之后会使用其监听submit事件*/
        $update_form = $task_detail.find('form');
        /*选中显示task内容的元素*/
        $task_detail_content =$update_form.find('.content');
        /*选中显示task input的元素*/
        $task_detail_content_input = $update_form.find('[name=content]');
        /*双击内容元素显示input，隐藏自己*/
        $task_detail_content.on('dblclick',function () {
            $task_detail_content_input.show();
            $task_detail_content.hide();
        })

        $update_form.on('submit', function (e) {
            e.preventDefault();
            var data = {};
            /*获取表单中各个input的值*/
            data.content = $(this).find('[name=content]').val();
            data.desc = $(this).find('[name=desc]').val();
            data.remind_date = $(this).find('[name=remind_date]').val();
            update_task(index, data);
            hide_task_detail();
        })
    }


    /*添加task*/
    function add_task(new_task) {

        /*将新Task推入Task__list*/
        task_list.push(new_task);
        /*更新localStorage*/
        refresh_task_list();
        return true;
    }

    /*刷新local storage数据并渲染模板*/
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
        /*更新localStorage*/
        refresh_task_list();
    }


    function init() {
        task_list = store.get('task_list') || [];
        if(task_list.length) render_task_list();
    }


    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');
        for(var i = 0;i<task_list.length;i++){
            var $task = render_task_item(task_list[i],i);
            $task_list.prepend($task);
        }
        /*实时更新锚点*/
        $task_delete = $('.action.delete');
        $task_detail_trigger = $('.action.detail');
        listen_delete_task();
        listen_task_detail();
    }

    /*渲染单条task*/
    function render_task_item(data,index) {
        if(!data || !index) return;
        var list_item_tpl =
            '<div class="task-item" data-index="' +index+ '">' +
            '<span><input type="checkbox"/></span>' +
            '<span class="task-content">'+ data.content +'</span>' +
            '<span class="action delete"> 删除 </span>' +
            '<span class="action detail"> 详细 </span>' +
            '</div>';
        return $(list_item_tpl);
    }
})();
