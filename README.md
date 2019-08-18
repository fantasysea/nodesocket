# 项目说明
由于最近要做socket通讯,客户端是android实现的,node服务端是现学现卖,之前没进行过这方面的学习和开发,所以语法和结构都存在比较大的问题,大家做个参考即可.实际上,做这个粘包处理,参考了这个项目[stick](https://github.com/lvgithub/stick),但是我这个处理的方案和stick项目的不太一样,stick项目自己维护了一个缓存,会动态增加,自己维护2个下标进行数据的维护.这样内存会有存在一直增大的可能,可能需要再次处理过大的缓存.我的方法是每次的缓存都是按照实际大小重新创建的,但这样需要消耗cpu资源进行复制.
# 包体结构
整体包结构如下图，请求头包含event，content-length，seq-number，content。由于我们要进行心跳，所以为了减少数据 ，ping，pong仅仅需要event部分即可。
## 总体结构
| event   | content-length($CL)   | seq-number        |       content       |
|:-------:|:---------------------:|:-----------------:|:-------------------:|
| <num>(2)|   <num>(2)            | <num>(3)          | <buffer>($CL)       |

### 特殊包（ping，pong）

| event   |
|:-------:|
| <num>(2)|

seq-number是一个0-0xffffff循环的数字,实际上使用的时候,我用event来做业务类型的区分,seq-number是每次请求的唯一id,做对应关系.content可以是string,json等,但是都转换成buffer来传输.

#使用说明

## 启动服务器 
```
npm install
node socket_server.js
```

## 模拟客户端
```
node socket_clent.js
```

//todo  
 - [] connection的管理
 - [] 内存管理,例如:多个connection有一些可以共同管理
 - [] 每个请求存到队列中,pop出来处理或者进行多线程处理