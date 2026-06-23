export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  motDePasse?: string;
  role: 'ADMIN' | 'CONDUCTEUR' | 'VISITEUR';
  dateInscription: Date;
  dtype: string;
  vehicule?: string;
  derniereConnexion: Date;
  niveauAcces: number;
  estBloque: boolean;
  typePrise?: string;
  typeUtilisateur: string;
}