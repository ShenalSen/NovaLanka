# -------- Build Arguments --------
ARG MODIFY_APIM_VERSION=4.5.0
ARG MODIFY_MI_VERSION=4.4.0
ARG BUILD_PLATFORM=linux/amd64
ARG MODIFY_IS_VERSION=7.2.0

# -------- Pull WSO2 Base Images --------
FROM --platform=${BUILD_PLATFORM} wso2/wso2am:${MODIFY_APIM_VERSION} AS wso2api
FROM --platform=${BUILD_PLATFORM} wso2/wso2mi:${MODIFY_MI_VERSION} AS wso2mi
FROM --platform=${BUILD_PLATFORM} wso2/wso2is:${MODIFY_IS_VERSION} AS wso2is

# -------- Final Image Base --------


# Use Ubuntu as base image and install Java, MySQL, Node.js, and other dependencies
FROM ubuntu:22.04

# -------- Set Working Directory --------
WORKDIR /app/


# -------- Install Required Packages --------
RUN apt-get update && apt-get install -y \
    openjdk-21-jdk \
    mysql-server \
    wget \
    curl \
    gnupg \
    sudo \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

# -------- Setup Java Environment --------

# Dynamically determine JAVA_HOME based on installed Java and set as ENV
RUN JAVA_PATH=$(dirname $(dirname $(readlink -f $(which java)))) && \
    echo "export JAVA_HOME=$JAVA_PATH" >> /etc/profile && \
    echo "export PATH=$JAVA_PATH/bin:$PATH" >> /etc/profile && \
    echo "JAVA_HOME=$JAVA_PATH" >> /etc/environment && \
    echo $JAVA_PATH > /java_path.txt

# -------- MySQL Environment Variables --------
ENV MYSQL_ROOT_PASSWORD=12345
ENV MYSQL_DATABASE=insurance
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=12345


# JAVA_HOME and PATH will be set dynamically in entrypoint.sh at runtime

# -------- Set Final Working Directory --------
WORKDIR /home/wso2

# -------- Copy WSO2 Distributions --------
COPY --from=wso2api /home/wso2carbon/wso2am-* /home/wso2carbon/wso2am
COPY --from=wso2mi  /home/wso2carbon/wso2mi-* /home/wso2carbon/wso2mi
COPY --from=wso2is  /home/wso2carbon/wso2is-* /home/wso2carbon/wso2is

# -------- Configure WSO2 Identity Server --------
RUN sed -i "/\[server\]/a offset = 2" /home/wso2carbon/wso2is/repository/conf/deployment.toml

# -------- Configure WSO2 API Manager --------
RUN sed -i "s/#offset=0/offset=3/" /home/wso2carbon/wso2am/repository/conf/deployment.toml

# -------- Copy Artifacts --------
COPY MI/carbonapps /home/wso2carbon/wso2mi/repository/deployment/server/carbonapps
RUN curl -L -o /home/wso2carbon/wso2mi/lib/mysql-connector-j-9.2.0.jar https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/9.2.0/mysql-connector-j-9.2.0.jar
RUN curl -L -o /home/wso2carbon/wso2is/repository/components/lib/mysql-connector-j-9.2.0.jar https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/9.2.0/mysql-connector-j-9.2.0.jar

COPY mysql-scripts/ /app/schemas/
COPY Configs/.env /home/wso2/missedCallsHandler.env
COPY Frontend/ /home/wso2/app

# -------- Copy Chatbot Service Artifacts --------
COPY BI/chatbot/chatbot.jar /home/wso2/BI/chatbot/chatbot.jar
COPY BI/chatbot/Config.toml /home/wso2/BI/chatbot/Config.toml
COPY BI/proxy/mcp_proxy.jar /home/wso2/BI/proxy/mcp_proxy.jar

# -------- Install Frontend Dependencies --------
WORKDIR /home/wso2/app
RUN npm install && \
    chmod +x ./node_modules/.bin/tsc && \
    chmod +x ./node_modules/.bin/vite

# -------- Copy Shell Scripts --------
COPY init_db.sh /home/wso2/init_db.sh
COPY start_services.sh /home/wso2/start_services.sh
COPY chatbot.sh /home/wso2/chatbot.sh
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /home/wso2/init_db.sh /home/wso2/start_services.sh /home/wso2/chatbot.sh /entrypoint.sh

# -------- Expose Required Ports --------
EXPOSE 9090 9091 9092 9093 9094 9095 9096 \
    8090 8253 8254 8290 9164 3306 9446 9443 \
    8246 8283 1025 8025 5173

# -------- Run Entrypoint Script --------
CMD ["/entrypoint.sh"]
