# -------- Build Arguments --------
ARG MODIFY_APIM_VERSION=4.6.0
ARG MODIFY_MI_VERSION=4.5.0
ARG BUILD_PLATFORM=linux/amd64
ARG MODIFY_IS_VERSION=7.2.0
ARG MODIFY_ICP_VERSION=1.2.0

# -------- Pull WSO2 Base Images --------
FROM --platform=${BUILD_PLATFORM} wso2/wso2am:${MODIFY_APIM_VERSION} AS wso2api
FROM --platform=${BUILD_PLATFORM} wso2/wso2mi:${MODIFY_MI_VERSION} AS wso2mi
FROM --platform=${BUILD_PLATFORM} wso2/wso2-integration-control-plane:${MODIFY_ICP_VERSION} AS wso2icp
FROM --platform=${BUILD_PLATFORM} wso2/wso2is:${MODIFY_IS_VERSION} AS wso2is

# -------- Final Image Base --------
FROM ubuntu:22.04

# -------- Set Working Directory --------
WORKDIR /app

# -------- Install Required Packages --------
RUN apt-get update && apt-get install -y --no-install-recommends \
    openjdk-21-jdk \
    wget \
    curl \
    gnupg \
    sudo \
    ca-certificates \
    mysql-client \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# -------- Setup Java Environment --------
# Dynamically determine JAVA_HOME based on installed Java and set as ENV
RUN JAVA_PATH=$(dirname $(dirname $(readlink -f $(which java)))) && \
    echo "export JAVA_HOME=$JAVA_PATH" >> /etc/profile && \
    echo "export PATH=$JAVA_PATH/bin:$PATH" >> /etc/profile && \
    echo "JAVA_HOME=$JAVA_PATH" >> /etc/environment

# -------- Runtime Environment Variables --------
# Database credentials are passed via docker-compose.yml environment variables
# JAVA_HOME and PATH will be set dynamically in entrypoint.sh at runtime

# -------- Set Final Working Directory --------
WORKDIR /home/wso2

# -------- Copy WSO2 Distributions --------
COPY --from=wso2api /home/wso2carbon/wso2am-* /home/wso2carbon/wso2am
COPY --from=wso2mi  /home/wso2carbon/wso2mi-* /home/wso2carbon/wso2mi
COPY --from=wso2is  /home/wso2carbon/wso2is-* /home/wso2carbon/wso2is
COPY --from=wso2icp  /home/wso2carbon/wso2-integration-control-plane-* /home/wso2carbon/wso2icp

# -------- Copy WSO2 Configuration Files --------
# Copy API Manager configurations
COPY --chown=wso2carbon:wso2 src/backend/config/wso2-am/repository/ /home/wso2carbon/wso2am/repository/

# Copy Identity Server configurations
COPY --chown=wso2carbon:wso2 src/backend/config/wso2-is/repository/ /home/wso2carbon/wso2is/repository/

# Copy Micro Integrator configurations
COPY --chown=wso2carbon:wso2 src/backend/config/wso2-mi/conf/ /home/wso2carbon/wso2mi/conf/

# Copy JKS files to WSO2 IS and MI
COPY --chown=wso2carbon:wso2 src/backend/config/certs /home/wso2carbon/wso2is/repository/resources/security
COPY --chown=wso2carbon:wso2 src/backend/config/certs/ /home/wso2carbon/wso2mi/repository/resources/security

# -------- Configure WSO2 API Manager --------
ARG APIM_PORT_OFFSET=3
RUN sed -i "s/#offset=0/offset=${APIM_PORT_OFFSET}/" /home/wso2carbon/wso2am/repository/conf/deployment.toml

# -------- Enable MI Service Catalog --------
RUN sed -i "s/# \[\[service_catalog\]\]/[[service_catalog]]/" \
    /home/wso2carbon/wso2mi/conf/deployment.toml && \
    sed -i "/\[\[service_catalog\]\]/,/^\s*$/ {s|# apim_host = \"https://localhost:9443\"|apim_host = \"https://localhost:9446\"|}" \
    /home/wso2carbon/wso2mi/conf/deployment.toml && \
    sed -i "/\[\[service_catalog\]\]/,/^\s*$/ {s|# enable = true|enable = true|}" \
    /home/wso2carbon/wso2mi/conf/deployment.toml && \
    sed -i "/\[\[service_catalog\]\]/,/^\s*$/ {s|# username = \"admin\"|username = \"admin\"|}" \
    /home/wso2carbon/wso2mi/conf/deployment.toml && \
    sed -i "/\[\[service_catalog\]\]/,/^\s*$/ {s|# password = \"admin\"|password = \"admin\"|}" \
    /home/wso2carbon/wso2mi/conf/deployment.toml

# -------- Copy Artifacts --------
COPY src/backend/micro-integrator/carbonapps /home/wso2carbon/wso2mi/repository/deployment/server/carbonapps
RUN curl -L -o /home/wso2carbon/wso2mi/lib/mysql-connector-j-9.2.0.jar https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/9.2.0/mysql-connector-j-9.2.0.jar && \
    chmod +x /home/wso2carbon/wso2mi/lib/mysql-connector-j-9.2.0.jar
COPY src/database/mysql-scripts/ /app/schemas/
COPY src/backend/apis/ /home/wso2/apis/
COPY src/frontend/ /home/wso2/app

# -------- Install Frontend Dependencies --------
WORKDIR /home/wso2/app
RUN npm install && \
    chmod +x ./node_modules/.bin/tsc && \
    chmod +x ./node_modules/.bin/vite

# -------- Copy Container Initialization Scripts --------
RUN mkdir -p /app/container-scripts
COPY deployment/container-init/*.sh /app/container-scripts/

# -------- Copy Orchestrator Entrypoint --------
COPY deployment/container-entrypoint.sh /container-entrypoint.sh

# -------- Create config directory and copy environment files --------
RUN mkdir -p /config /usr/local/bin
COPY deployment/config/apictl.env /config/apictl.env
COPY deployment/config/iamctl.env /config/iamctl.env

# -------- Copy CLI tools (apictl and iamctl) --------
COPY deployment/tools/apictl /usr/local/bin/apictl
COPY deployment/tools/iamctl /usr/local/bin/iamctl

# -------- Make Scripts Executable --------
RUN chmod +x \
    /container-entrypoint.sh \
    /app/container-scripts/*.sh \
    /usr/local/bin/apictl \
    /usr/local/bin/iamctl

# -------- Expose Required Ports --------
EXPOSE 9090 9091 9092 9093 9094 9095 9096 \
    8090 8253 8254 8290 9164 3306 9446 9443 \
    8246 8283 1025 8025 5173

# -------- Run Container Orchestrator Entrypoint --------
CMD ["/container-entrypoint.sh"]

