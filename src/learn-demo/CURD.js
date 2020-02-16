const { Blog, User } = require('./sequelize');

!(async function() {
    // findOne类似  通过blog.dataValues取值
    const blogPageList = await Blog.findAll({
        limit: 2, // 限制本次查询
        offset: 2, // 跳过多少条， 也就是分页
        order: [['id', 'desc']],
    });
    console.log(
        'blogPageList',
        blogPageList.map(blog => blog.dataValues)
    );

    // 连表查询1  Blog.belongsTo(User, {}）
    // findAndCountAll不考虑分页
    const blogListWIthUser = await Blog.findAndCountAll({
        order: [['id', 'desc']],
        include: [
            {
                model: User,
                attributes: ['userName', 'nickname'],
                where: {
                    userName: 'lgc',
                },
            },
        ],
    });
    console.log(
        'blogListWIthUser',
        blogListWIthUser.count,
        blogListWIthUser.rows.map(blog => {
            const blogVal = blog.dataValues;
            // 这里的blogVal.user是sequelize.define('user', {})时的名字
            blogVal.user = blogVal.user.dataValues;
            return blogVal;
        })
    );

    // 连表查询2 User.hasMany(Blog, {})
    const userListWithBlog = await User.findAndCountAll({
        attributes: ['userName', 'nickname'],
        include: [
            {
                model: Blog,
            },
        ],
    });
    console.log(
        'userListWithBlog',
        userListWithBlog.count,
        userListWithBlog.rows.map(user => {
            const userVal = user.dataValues;
            // 一个用户可能有多个博客  所以user下面的字段叫blogs 而不是blog
            userVal.blogs = userVal.blogs.map(blog => blog.dataValues);
            return userVal;
        })
    );
})();
