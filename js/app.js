/* 
问题：
    1 修改数据，双击的时候如果不获取光标，就无法回车
    2 为什么return this.dataList.filter(item => !item.isFinish).length
        和return this.dataList.filter((item) => {!item.isFinish}).length效果不一样
    3 不明白 showAll() 这个方法是干什么用的
    4 hashchange事件还是不太清除
*/
(function (window, Vue, undefined) {
    new Vue({
        el: '#app',
        data: {
            dataList: JSON.parse(window.localStorage.getItem('dataList')) || [],
            newTodo: '',
            dataForBeforUpdate: {},
            showArr: [],
            activeBtn: 1
        },
        methods: {
            // 添加方法
            addTodo() {
                // if (this.newTodo.length == 0) return;   //此方法无法解决空格添加问题
                if (!this.newTodo.trim()) return;
                this.dataList.push({
                    id: this.dataList.length ? this.dataList.sort((a, b) => { a.id - b.id })[this.dataList.length - 1]['id'] + 1 : 1,
                    content: this.newTodo.trim(),
                    isFinish: false
                })
                // console.log(this.dataList)
                this.newTodo = '';
            },
            // 删除一条数据
            delTodo(index) {
                this.dataList.splice(index, 1);
                // console.log(1);
            },
            //删除多条选中的已经completed的数据
            delAllTodo() {
                this.dataList = this.dataList.filter(item => !item.isFinish);
            },
            // 修改表单中的数据
            editTodo(index) {
                // console.log(this.$refs.edit);
                this.$refs.edit.forEach((v) => {
                    v.classList.remove('editing');
                })
                this.$refs.edit[index].classList.add('editing');
                // 保存修改之前的数据到dataForBeforUpdate对象中
                this.dataForBeforUpdate = JSON.parse(JSON.stringify(this.dataList[index]));

            },
            // 提交修改后的表单数据
            updateTodo(index) {
                this.$refs.edit[index].classList.remove('editing');
                // 如果修改的数据为空，则删除当前数据
                if (!this.dataList[index].content.trim()) return this.dataList.splice(index, 1);
                // 如果修改原数据，则isFinish为false
                if (this.dataList[index].content !== this.dataForBeforUpdate.content) this.dataList[index].isFinish = false;
                // 按回车时移除class名editing

                // 清空dataForBeforUpdate中的数据
                this.dataForBeforUpdate = {};
            },
            // 还原内容
            escTodo(index) {
                this.dataList[index].content = this.dataForBeforUpdate.content;
                this.$refs.edit[index].classList.remove('editing');
                this.dataForBeforUpdate = {};
            },
            // hashChange事件
            /* hashchange() {
                switch (window.location.hash) {
                    case '':
                    case '#/':
                        // showAll();
                        this.activeBtn = 1;
                        break
                    case '#/active':
                        // activeAll(false);
                        this.activeBtn = 2;
                        break;
                    case '#/completed':
                        // activeAll(true);
                        this.activeBtn = 2;
                        break;
                }
            }, */
            hashchange() {
                switch (window.location.hash) {
                    case '':
                    case '#/':
                        // this.showAll()
                        this.activeBtn = 1
                        break
                    case '#/active':
                        // this.activeAll(false)
                        this.activeBtn = 2
                        break
                    case '#/completed':
                        // this.activeAll(true)
                        this.activeBtn = 3
                        break
                }
            },
            // 创建一个显示的数组（）
            showAll() {
                this.showArr = this.dataList.map(() => true)
                // console.log(this.dataList.map(() => true));
            },
            // 修改显示的数组使用
            activeAll(boo) {
                /* this.showAll = this.dataList.map(item => item.isFinish === boo);
                if (this.dataList.every(item => item.isFinish === !boo)) return window.location.hash = '#/'; */
                this.showArr = this.dataList.map(item => item.isFinish === boo)
                if (this.dataList.every(item => item.isFinish === !boo)) return window.location.hash = '#/'
            },

        },
        //  利用localStorage持久化存储数据，在页面中展示
        watch: {
            dataList: {
                handler(newArr) {
                    window.localStorage.setItem('dataList', JSON.stringify(newArr));
                    this.hashchange();
                },
                deep: true
            }
        },
        computed: {
            // completed为false的数据
            activeNum() {
                // return this.dataList.filter()
                return this.dataList.filter(item => !item.isFinish).length;
            },
            // 设置全选反选按钮
            toggleAll: {
                get() {
                    return this.dataList.every(item => item.isFinish);
                },

                set(val) {
                    this.dataList.forEach(item => item.isFinish = val)
                }
            }

        },

        directives: {
            focus: {
                inserted(el) {
                    el.focus();
                }
            }
        },
        // 生命周期
        created() {
            // this.hashchange()
            window.hashchange = () => {
                this.hashchange()
            }
        }
    });
})(window, Vue);
