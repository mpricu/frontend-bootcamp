import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../model/product';
import { Subject, Subscription } from 'rxjs';
import { WishlistStateService } from '../../services/wishlist-state.service';
import { DomainStatus, Status } from '../../modules/shared/models/DomainStatus';

@Component({
  selector: 'app-wishlist-products',
  templateUrl: './wishlist-products.component.html',
  styleUrls: ['./wishlist-products.component.scss'],
})
export class WishlistProductsComponent implements OnInit, OnDestroy {
  s = new Subject();
  showProductFavorite = false;
  requestStatuses: typeof Status = Status;
  domainStatusWishlistProducts: DomainStatus<Array<Product>>;
  productsFavorite: Array<Product> = [];
  hasError: boolean;
  subscriptions: Subscription[] = [];

  constructor(private wishlistServiceState: WishlistStateService) {}

  public loadWishlistProducts(): void {
    this.subscriptions.push(
      this.wishlistServiceState
        .loadWishlistProductsAndHandleResponse()
        .subscribe()
    );
  }

  ngOnInit(): void {
    this.loadWishlistProducts();
    this.subscriptions.push(
      this.wishlistServiceState.wishlistDomainStatus$.subscribe(
        (wishlistDomainStatus: DomainStatus<Array<Product>>) => {
          this.domainStatusWishlistProducts = wishlistDomainStatus;
        }
      )
    );
  }

  handleProductAddedToFavorite(product: Product): void {
    this.productsFavorite.push(product);
  }

  ngOnDestroy(): void {
    // this.s.next();
    // this.s.complete();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
