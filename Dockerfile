# base image
FROM node:12.2.0-alpine as build
ENV PATH /app/node_modules/.bin:$PATH
RUN mkdir /app
# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app
#COPY . ./
#RUN npm install
# RUN npm config set unsafe-perm true
# RUN npm install --frozen-lockfile

COPY . /app
#RUN npm build
# RUN yarn build
#RUN npm install react-scripts@3.0.1 -g --silent


FROM nginx:alpine
#Copying over the conf file for nginx
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80


# start app
# CMD ["yarn", "start"]
#CMD ["yarn", "start"]
CMD ["nginx", "-g", "daemon off;"]
