mkdir -p src/images
curl https://codeload.github.com/afuh/rick-and-morty-api/tar.gz/master |
  tar --directory=src/images -xz --strip=2 rick-and-morty-api-master/images
