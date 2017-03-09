class SessionsController < Clearance::SessionsController
  def show
    respond_to do |format|
      format.json do
        if signed_in?
          render_current_user
        else
          head :unauthorized
        end
      end
    end
  end

  def create
    sleep 1 unless Rails.env.test?
    @user = authenticate(params)

    sign_in(@user) do |status|
      if status.success?
        sign_in_was_successful
      else
        sign_in_failed(status.failure_message)
      end
    end
  end

  def destroy
    sign_out
    respond_to do |format|
      format.html { redirect_to root_path }
      format.json { head :ok }
    end
  end

  private

  def sign_in_was_successful
    respond_to do |format|
      format.html { redirect_back_or url_after_create }
      format.json { render_current_user }
    end
  end

  def sign_in_failed(message)
    respond_to do |format|
      format.html { render html: '', layout: true, status: :unauthorized }
      format.json { render json: { error: message }, status: :unauthorized }
    end
  end

  def render_current_user
    render json: current_user, include: { memberships: { group: :members } }
  end
end
