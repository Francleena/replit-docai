{
  description = "Replit Nix Flake: Python + Node + FastAPI";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";

  outputs = { self, nixpkgs }: {
    devShells.default = nixpkgs.lib.mkShell {
      buildInputs = [
        nixpkgs.python311
        nixpkgs.python311Packages.pip
        nixpkgs.python311Packages.setuptools
        nixpkgs.python311Packages.wheel
        nixpkgs.python311Packages.fastapi
        nixpkgs.python311Packages.uvicorn
        nixpkgs.python311Packages.python-multipart
        nixpkgs.python311Packages.pydantic

        nixpkgs.nodejs-20_x
        nixpkgs.nodePackages.npm
      ];

      shellHook = ''
        export NIX_STORE_DIR=/home/runner/workspace/.nix-store
        mkdir -p $NIX_STORE_DIR
        echo "Using writable Nix store at $NIX_STORE_DIR"
      '';
    };
  };
}
