{ pkgs, ... }:

{
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_20;
    npm.enable = true;
  };

  enterShell = ''
    if [ -f package.json ]; then
      npm install

      npm run dev
    fi
  '';
}
