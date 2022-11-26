<template>
  <div class="abstract-item center drawline" @click="$router.push(item.path)">
    <div v-if="this.isShowDetailImg" class="cover-wrap " :class="imageStyle" :style="{ ...bgImageStyle}">
    </div>
    <div class="abstract-content-wrap " :class="imageStyle" :style="titleStyle">
      <i v-if="item.frontmatter.sticky" class="iconfont reco-sticky"></i>
      <div class="title">
        <i v-if="item.frontmatter.keys" class="iconfont reco-lock" style="font-size: 40px"></i>
        <router-link :to="item.path">{{item.title}}</router-link>
      </div>
      <!-- <div class="abstract" v-html="item.excerpt"></div> -->
      <PageInfo :pageInfo="item" :currentTag="currentTag">
      </PageInfo>
    </div>
  </div>
</template>

<script>
import PageInfo from './PageInfo'
export default {
  components: { PageInfo },
  props: ['item', 'currentPage', 'currentTag','index'],
  data () {
    return {
      bgUrl: null,
      isShowDetailImg: false,
      DetailImgSrc: "",
      titleStyle: "",
      imageStyle:""
    }
  },
  created(){
    //地址 bgUrls
    //个数 bgNum
    const url = "https://lio98.gitee.io/sourceimg/"
    const bgNum =64
    var inum = this.RandomNum(1,bgNum)+this.index
    if(inum>bgNum)
    {
      inum= inum - bgNum
    }
    this.bgUrl = this.timestamp(url + inum + '.jpg');
    if("isShowDetailImg" in this.item.frontmatter){
      this.isShowDetailImg=this.item.frontmatter.isShowDetailImg;
    }
    if("DetailImgSrc" in this.item.frontmatter){
      this.DetailImgSrc=this.item.frontmatter.DetailImgSrc;
    }
    if(this.isShowDetailImg ){
      //显示图片，文件没有指定图片地址，则使用随机地址
      if(this.DetailImgSrc!==null&&this.DetailImgSrc!=="" &&this.DetailImgSrc!==" "){
        this.bgUrl=this.DetailImgSrc
      }
      this.titleStyle="height: 12rem"
    }
    if(this.index % 2 === 0)
    {
      this.imageStyle="flyl"
    }
    else{
      if(this.isShowDetailImg ){
        this.imageStyle="flyr"
      }
      else{
        this.imageStyle="flyl"
      }
    }
  },
  computed:{
    bgImageStyle () {
      const initBgImageStyle = {
        background: `
          url(${this.bgUrl}) center/cover no-repeat
        `
      }
      const {
        bgImageStyle
      } = this.$frontmatter
      return bgImageStyle ? { ...initBgImageStyle, ...bgImageStyle } : initBgImageStyle
    },
  },
  methods: {
    onClick(){
      const height = document.documentElement.clientHeight;
      window.scrollTo(0,height);
    },
    //新连接
    timestamp(url){
      var getTimestamp=new Date().getTime();
      if(url.indexOf("?")>-1){
        url=url+"&timestamp="+getTimestamp
      }else{
        url=url+"?timestamp="+getTimestamp
      }
      return url
    },
    //获取范围内随机数
    RandomNum(Min,Max){
      var Range = Max - Min;
      var Rand = Math.random();   
      return Min + Math.round(Rand * Range)
    }
  }
}
</script>

<style lang="stylus" scoped>
@require '../styles/mode.styl'
.abstract-item
  position relative
  margin: 0 auto 20px;
  padding: 16px 20px;
  width 100%
  overflow: hidden;
  border-radius: $borderRadius
  box-shadow: var(--box-shadow);
  box-sizing: border-box;
  transition all .3s
  cursor: pointer;
  > * {
    pointer-events: auto;
  }
  .reco-sticky
    position absolute
    top 0
    left 0
    display inline-block
    color $accentColor
    font-size 2.4rem
  &:hover
    box-shadow: var(--box-shadow-hover)
  .title
    position: relative;
    font-size: 1.5rem;
    line-height: 46px;
    margin-bottom: 20px
    display: inline-block;
    a
      color: var(--text-color);
    .reco-lock
      font-size 1.28rem
      color $accentColor
    &:after
      content: "";
      position: absolute;
      width: 100%;
      height: 2px;
      bottom: 0;
      left: 0;
      // background-color: $accentColor;
      visibility: hidden;
      -webkit-transform: scaleX(0);
      transform: scaleX(0);
      transition: .3s ease-in-out;
    &:hover a
      // color $accentColor
    &:hover:after
      visibility visible
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
  .tags
    .tag-item
      &.active
        color $accentColor
      &:hover
        color $accentColor
@media (max-width: $MQMobile)
  .tags
    display block
    margin-top 1rem;
    margin-left: 0!important;

.cover-wrap{
  width: 40%;
  flex: 1;
  border-radius: 0.5rem;
  overflow: hidden;
  height: 12.5rem;
  position: relative;
  text-align: center;
  background-size: 100% 100%;
}
.flyl{
  float: left 
}
.flyr{
  float: right 
}
.abstract-content-wrap {
  width: 55%;
  height: 6rem;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  display: flex;
  transition: all .3s;
  margin-left: 5%
}
.drawline {
  transition: color 0.25s;
}
.drawline::before, .drawline::after {
  border: 2px solid transparent;
  width: 0;
  height: 0;
}
.drawline::before, .drawline::after {
  box-sizing: inherit;
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
}
.center:hover {
  color: #6477b9;
}
.center::before, .center::after {
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  -webkit-transform-origin: center;
          transform-origin: center;
}
.center::before {
  border-top: 2px solid #70DAAA;
  border-bottom: 2px solid #70DAAA;
  -webkit-transform: scale3d(0, 1, 1);
          transform: scale3d(0, 1, 1);
}
.center::after {
  border-left: 2px solid #70DAAA;
  border-right: 2px solid #70DAAA;
  -webkit-transform: scale3d(1, 0, 1);
          transform: scale3d(1, 0, 1);
}
.center:hover::before, .center:hover::after {
  -webkit-transform: scale3d(1, 1, 1);
          transform: scale3d(1, 1, 1);
  transition: transform 0.5s, -webkit-transform 0.5s;
}
</style>
