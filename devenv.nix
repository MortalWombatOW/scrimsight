{ pkgs, ... }:

{
  # https://devenv.sh/basics/
  env.GREET = "=== loading devenv for scrimsight ===";

  # https://devenv.sh/packages/
  packages = [ pkgs.git ];

  enterShell = ''
    hello
    npm outdated
    git --version
    tsc --version
  '';

  # https://devenv.sh/languages/
  languages.nix.enable = true;
  languages.typescript.enable = true;

  # https://devenv.sh/scripts/
  scripts.hello.exec = "echo $GREET";

  # https://devenv.sh/pre-commit-hooks/
  pre-commit.hooks.shellcheck.enable = true;

  # https://devenv.sh/processes/
  # processes.ping.exec = "ping example.com";
}
