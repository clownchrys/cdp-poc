region := ap-northeast-2
aws_account_id := 385537130119
repo_uri := ${aws_account_id}.dkr.ecr.${region}.amazonaws.com/jk-dev-ecr-repo-cdp-poc-01

containers := frontend streamlit mongo

docker-login:
	@aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${repo_uri}

ecr-push: docker-login ecr-destination
	@$(foreach container, ${containers}, \
		docker build -t cdp-poc:${container} --build-arg BUILD_ENV=prod ./${container} && \
		docker tag cdp-poc:${container} ${repo_uri}:${container} && \
		docker push ${repo_uri}:${container}; \
	)

ecr-destination:
	@echo ${repo_uri}:{tag_name}

dev-up:
	@docker compose -f docker-compose.dev.yaml up -d --build

dev-down:
	@docker compose -f docker-compose.dev.yaml down

dev-restart: dev-down dev-up

prod-up:
	@docker compose -f docker-compose.prod.yaml up -d --build

prod-down:
	@docker compose -f docker-compose.prod.yaml down

prod-restart: prod-down prod-up
