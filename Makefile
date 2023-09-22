region := ap-northeast-2
aws_account_id := 385537130119
repo_uri := ${aws_account_id}.dkr.ecr.${region}.amazonaws.com/jk-dev-ecr-repo-cdp-poc-01

login:
	@aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${repo_uri}

push:
	@docker build -t cdp-poc:frontend ./frontend
	@docker tag cdp-poc:frontend ${repo_uri}:frontend
	@docker push ${repo_uri}:frontend

	@docker build -t cdp-poc:streamlit ./streamlit
	@docker tag cdp-poc:streamlit ${repo_uri}:streamlit
	@docker push ${repo_uri}:streamlit

	@docker build -t cdp-poc:mongo ./mongo
	@docker tag cdp-poc:mongo ${repo_uri}:mongo
	@docker push ${repo_uri}:mongo

destination:
	@echo ${repo_uri}:{tag_name}
