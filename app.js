const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');
const reptileUrl = "http://www.jianshu.com/";

function replaceText(text) {
    return text.replace(/\n/g, "").replace(/\s/g, "");
}
superagent.get(reptileUrl).end(function (err, res) {
    if (err) {
        return console.error(err);
    }
    let $ = cheerio.load(res.text);
    let data = [];
    $('#list-container .note-list li').each(function(i, elem) {
        let _this = $(elem);
            data.push({
            title: replaceText(_this.find('.title').text()),                                    //标题
            abstract: replaceText(_this.find('.abstract').text()),                              //描述
            thumbnails: _this.find('.wrap-img img').attr('src'),                                //缩略图
            collection_tag: replaceText(_this.find('.collection-tag').text()),                  //文集分类标签
            reads_count: replaceText(_this.find('.ic-list-read').parent().text()) * 1,          //阅读计数
            comments_count: replaceText(_this.find('.ic-list-comments').parent().text()) * 1,   //评论计数
            likes_count: replaceText(_this.find('.ic-list-like').parent().text()) * 1,          //喜欢计数
            author: {                                                                           //作者信息
                avatar: _this.find('.avatar img').attr('src'),                                  //会员头像
                nickname: replaceText(_this.find('.blue-link').text()),                         //会员昵称
                sharedTime: _this.find('.time').attr('data-shared-at')                          //发布日期
            }
        });
    });
    // 写入数据
    fs.writeFile(__dirname + '/data/article.json', JSON.stringify({
        status: 0,
        data: data
    }), function (err) {
        if (err) throw err;
        console.log('写入完成');
    });
});
