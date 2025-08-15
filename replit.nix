{ pkgs }:

pkgs.mkShell {
  buildInputs = [
    pkgs.python310
    pkgs.python310Packages.pip
    pkgs.python310Packages.setuptools
    pkgs.python310Packages.wheel
    pkgs.python310Packages.fastapi
    pkgs.python310Packages.uvicorn
    pkgs.python310Packages.python-multipart
    pkgs.python310Packages.pydantic

    pkgs.nodejs-20_x
    pkgs.nodePackages.npm
  ];

  shellHook = ''
    export NIX_STORE_DIR=/home/runner/workspace/.nix-store
    mkdir -p $NIX_STORE_DIR
    echo "Using writable Nix store at $NIX_STORE_DIR"
  '';
}
