import { Address } from 'viem';
import { ErrorService } from './error.service';

export interface CoproInfo {
  address: Address;
  initialFlats: number;
  additionalFlats: number;
  totalFlats: number;
}

export interface ApartmentInfo {
  id: number;
  owner: Address;
  isForSale: boolean;
  price?: bigint;
  exists: boolean;
}

export class CoproService {
  /**
   * Vérifie si une adresse est valide
   */
  static isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Formate le prix en ETH
   */
  static formatPrice(price: bigint): string {
    return (Number(price) / 1e18).toFixed(4);
  }

  /**
   * Formate une adresse pour l'affichage
   */
  static formatAddress(address: Address): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  /**
   * Vérifie si un utilisateur est propriétaire d'un appartement
   */
  static isOwner(userAddress: Address, apartmentOwner: Address): boolean {
    return userAddress.toLowerCase() === apartmentOwner.toLowerCase();
  }

  /**
   * Valide les données d'un appartement
   */
  static validateApartment(apartment: ApartmentInfo): boolean {
    return (
      apartment.id >= 0 &&
      CoproService.isValidAddress(apartment.owner) &&
      typeof apartment.isForSale === 'boolean' &&
      typeof apartment.exists === 'boolean'
    );
  }

  /**
   * Calcule le nombre total d'appartements
   */
  static calculateTotalFlats(initialFlats: number, additionalFlats: number): number {
    return initialFlats + additionalFlats;
  }

  /**
   * Filtre les appartements qui existent
   */
  static filterExistingApartments(apartments: ApartmentInfo[]): ApartmentInfo[] {
    return apartments.filter(apartment => apartment.exists);
  }

  /**
   * Filtre les appartements en vente
   */
  static filterApartmentsForSale(apartments: ApartmentInfo[]): ApartmentInfo[] {
    return apartments.filter(apartment => apartment.isForSale);
  }

  /**
   * Trouve les appartements d'un propriétaire
   */
  static findApartmentsByOwner(apartments: ApartmentInfo[], ownerAddress: Address): ApartmentInfo[] {
    return apartments.filter(apartment => 
      CoproService.isOwner(ownerAddress, apartment.owner)
    );
  }

  /**
   * Génère un message d'erreur pour les transactions
   */
  static getErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    if (error?.error?.message) {
      return error.error.message;
    }
    
    return 'Une erreur inconnue est survenue';
  }

  /**
   * Valide le prix d'un appartement
   */
  static validatePrice(price: bigint): boolean {
    return price > 0n;
  }

  /**
   * Vérifie si un appartement peut être acheté
   */
  static canBuyApartment(apartment: ApartmentInfo, userAddress?: Address): boolean {
    if (!apartment.exists || !apartment.isForSale || !apartment.price) {
      return false;
    }
    
    if (userAddress && CoproService.isOwner(userAddress, apartment.owner)) {
      return false; // Ne peut pas acheter sa propre propriété
    }
    
    return CoproService.validatePrice(apartment.price);
  }
} 