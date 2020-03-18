FROM node:current-slim

# 定义项目要上传的容器位置，也就是我们这个项目要放到那个容器中
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn

# 复制当前app目录文件到上面定义的目录WORKDIR中
COPY . .

# 对外开放端口，让外部可以访问容器内的app
EXPOSE 8080

# 启动App
CMD [ "yarn", "dev" ]
